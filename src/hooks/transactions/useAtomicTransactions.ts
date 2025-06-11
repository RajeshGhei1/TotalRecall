
import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TransactionOperation {
  id: string;
  type: 'insert' | 'update' | 'delete';
  table: string;
  data?: Record<string, any>;
  filter?: Record<string, any>;
  queryKey?: any[];
}

interface TransactionState {
  isRunning: boolean;
  operations: TransactionOperation[];
  completedOperations: string[];
  failedOperations: string[];
}

interface RollbackOperation {
  type: 'insert' | 'update' | 'delete';
  table: string;
  filter?: Record<string, any>;
  data?: Record<string, any>;
}

/**
 * Hook for atomic-like operations with rollback capabilities
 * Note: This provides atomic-like behavior by managing operations sequentially
 * but doesn't use actual database transactions due to Supabase limitations
 */
export const useAtomicTransactions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [state, setState] = useState<TransactionState>({
    isRunning: false,
    operations: [],
    completedOperations: [],
    failedOperations: [],
  });

  // Add operation to transaction queue
  const addOperation = useCallback((operation: Omit<TransactionOperation, 'id'>) => {
    const opWithId: TransactionOperation = {
      ...operation,
      id: `op-${Date.now()}-${Math.random()}`,
    };

    setState(prev => ({
      ...prev,
      operations: [...prev.operations, opWithId],
    }));

    return opWithId.id;
  }, []);

  // Clear all operations
  const clearOperations = useCallback(() => {
    setState(prev => ({
      ...prev,
      operations: [],
      completedOperations: [],
      failedOperations: [],
    }));
  }, []);

  // Execute all operations sequentially
  const executeTransaction = useCallback(async () => {
    if (state.operations.length === 0) {
      toast({
        title: 'No Operations',
        description: 'No operations to execute',
        variant: 'destructive',
      });
      return { success: false, results: [] };
    }

    setState(prev => ({ ...prev, isRunning: true }));

    try {
      const results: any[] = [];
      const completed: string[] = [];
      const queryKeysToInvalidate = new Set<string>();
      const rollbackOperations: RollbackOperation[] = [];

      // Execute operations sequentially
      for (const operation of state.operations) {
        try {
          let result: any;
          
          switch (operation.type) {
            case 'insert':
              const insertQuery = supabase
                .from(operation.table)
                .insert(operation.data!)
                .select('*');
              
              const { data: insertData, error: insertError } = await insertQuery;
              
              if (insertError) throw insertError;
              result = insertData;
              
              // Store rollback operation with proper typing
              if (insertData && Array.isArray(insertData) && insertData.length > 0) {
                const firstRecord = insertData[0] as Record<string, any>;
                if (firstRecord && 'id' in firstRecord && firstRecord.id != null) {
                  rollbackOperations.push({
                    type: 'delete',
                    table: operation.table,
                    filter: { id: firstRecord.id }
                  });
                }
              }
              break;

            case 'update':
              // Store current data for rollback
              const currentQuery = supabase
                .from(operation.table)
                .select('*')
                .match(operation.filter!)
                .single();
              
              const { data: currentData } = await currentQuery;

              const updateQuery = supabase
                .from(operation.table)
                .update(operation.data!)
                .match(operation.filter!)
                .select('*');
              
              const { data: updateData, error: updateError } = await updateQuery;
              
              if (updateError) throw updateError;
              result = updateData;
              
              // Store rollback operation
              if (currentData) {
                rollbackOperations.push({
                  type: 'update',
                  table: operation.table,
                  filter: operation.filter,
                  data: currentData
                });
              }
              break;

            case 'delete':
              // Store current data for rollback
              const deleteCurrentQuery = supabase
                .from(operation.table)
                .select('*')
                .match(operation.filter!);
              
              const { data: deleteCurrentData } = await deleteCurrentQuery;

              const deleteQuery = supabase
                .from(operation.table)
                .delete()
                .match(operation.filter!)
                .select('*');
              
              const { data: deleteData, error: deleteError } = await deleteQuery;
              
              if (deleteError) throw deleteError;
              result = deleteData;
              
              // Store rollback operation
              if (deleteCurrentData && Array.isArray(deleteCurrentData) && deleteCurrentData.length > 0) {
                rollbackOperations.push({
                  type: 'insert',
                  table: operation.table,
                  data: deleteCurrentData
                });
              }
              break;

            default:
              throw new Error(`Unknown operation type: ${operation.type}`);
          }

          results.push({ operationId: operation.id, result });
          completed.push(operation.id);

          // Collect query keys for invalidation
          if (operation.queryKey) {
            queryKeysToInvalidate.add(JSON.stringify(operation.queryKey));
          }

        } catch (operationError: any) {
          // Attempt to rollback completed operations
          console.log('Operation failed, attempting rollback...', operationError);
          
          // Perform rollback operations in reverse order
          for (let i = rollbackOperations.length - 1; i >= 0; i--) {
            const rollbackOp = rollbackOperations[i];
            try {
              switch (rollbackOp.type) {
                case 'insert':
                  await supabase.from(rollbackOp.table).insert(rollbackOp.data!);
                  break;
                case 'update':
                  await supabase.from(rollbackOp.table).update(rollbackOp.data!).match(rollbackOp.filter!);
                  break;
                case 'delete':
                  await supabase.from(rollbackOp.table).delete().match(rollbackOp.filter!);
                  break;
              }
            } catch (rollbackError) {
              console.error('Rollback operation failed:', rollbackError);
            }
          }
          
          setState(prev => ({
            ...prev,
            isRunning: false,
            failedOperations: [...prev.failedOperations, operation.id],
          }));

          toast({
            title: 'Transaction Failed',
            description: `Operation ${operation.id} failed: ${operationError.message}`,
            variant: 'destructive',
          });

          return { success: false, results, error: operationError.message };
        }
      }

      // Invalidate affected query keys
      queryKeysToInvalidate.forEach(keyStr => {
        const queryKey = JSON.parse(keyStr);
        queryClient.invalidateQueries({ queryKey });
      });

      setState(prev => ({
        ...prev,
        isRunning: false,
        completedOperations: [...prev.completedOperations, ...completed],
      }));

      toast({
        title: 'Transaction Completed',
        description: `Successfully executed ${completed.length} operations`,
      });

      return { success: true, results };

    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isRunning: false,
        failedOperations: [...prev.failedOperations, ...prev.operations.map(op => op.id)],
      }));

      toast({
        title: 'Transaction Error',
        description: `Transaction failed: ${error.message}`,
        variant: 'destructive',
      });

      return { success: false, results: [], error: error.message };
    }
  }, [state.operations, queryClient, toast]);

  return {
    addOperation,
    clearOperations,
    executeTransaction,
    state,
    isRunning: state.isRunning,
    operationCount: state.operations.length,
    completedCount: state.completedOperations.length,
    failedCount: state.failedOperations.length,
  };
};
