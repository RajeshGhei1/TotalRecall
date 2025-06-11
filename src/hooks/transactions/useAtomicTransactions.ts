
import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TransactionOperation {
  id: string;
  type: 'insert' | 'update' | 'delete';
  table: string;
  data?: any;
  filter?: any;
  queryKey?: any[];
}

interface TransactionState {
  isRunning: boolean;
  operations: TransactionOperation[];
  completedOperations: string[];
  failedOperations: string[];
}

/**
 * Hook for atomic transactions with rollback capabilities
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
    const opWithId = {
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

  // Execute all operations atomically
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
      // Start transaction
      const { data: transactionData, error: transactionError } = await supabase.rpc('begin_transaction');
      
      if (transactionError) {
        throw new Error(`Failed to start transaction: ${transactionError.message}`);
      }

      const results: any[] = [];
      const completed: string[] = [];
      const queryKeysToInvalidate = new Set<string>();

      // Execute operations sequentially
      for (const operation of state.operations) {
        try {
          let result;
          
          switch (operation.type) {
            case 'insert':
              const { data: insertData, error: insertError } = await supabase
                .from(operation.table)
                .insert(operation.data)
                .select();
              
              if (insertError) throw insertError;
              result = insertData;
              break;

            case 'update':
              const { data: updateData, error: updateError } = await supabase
                .from(operation.table)
                .update(operation.data)
                .match(operation.filter)
                .select();
              
              if (updateError) throw updateError;
              result = updateData;
              break;

            case 'delete':
              const { data: deleteData, error: deleteError } = await supabase
                .from(operation.table)
                .delete()
                .match(operation.filter)
                .select();
              
              if (deleteError) throw deleteError;
              result = deleteData;
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
          // Rollback transaction on any failure
          await supabase.rpc('rollback_transaction');
          
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

      // Commit transaction
      const { error: commitError } = await supabase.rpc('commit_transaction');
      
      if (commitError) {
        throw new Error(`Failed to commit transaction: ${commitError.message}`);
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
      // Ensure rollback on any unexpected error
      try {
        await supabase.rpc('rollback_transaction');
      } catch (rollbackError) {
        console.error('Failed to rollback transaction:', rollbackError);
      }

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
