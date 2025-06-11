
import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import type { TransactionOperation, TransactionState, TransactionResult } from '@/types/transaction-types';
import { executeSupabaseOperation } from '@/utils/transaction-operations';
import { RollbackManager } from '@/utils/rollback-manager';

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
  const executeTransaction = useCallback(async (): Promise<TransactionResult> => {
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
      const rollbackManager = new RollbackManager();

      // Execute operations sequentially
      for (const operation of state.operations) {
        try {
          // Prepare rollback before executing operation
          await rollbackManager.prepareRollback(operation, null);
          
          // Execute the operation
          const result = await executeSupabaseOperation(operation);
          
          if (result.error) {
            throw result.error;
          }

          results.push({ operationId: operation.id, result: result.data });
          completed.push(operation.id);

          // Collect query keys for invalidation
          if (operation.queryKey) {
            queryKeysToInvalidate.add(JSON.stringify(operation.queryKey));
          }

          console.log(`Operation ${operation.id} completed successfully`);

        } catch (operationError: any) {
          console.log('Operation failed, attempting rollback...', operationError);
          
          // Attempt to rollback completed operations
          await rollbackManager.executeRollback();
          
          setState(prev => ({
            ...prev,
            isRunning: false,
            failedOperations: [...prev.failedOperations, operation.id],
          }));

          toast({
            title: 'Transaction Failed',
            description: `Operation ${operation.id} failed: ${operationError.message || 'Unknown error'}`,
            variant: 'destructive',
          });

          return { success: false, results, error: operationError.message || 'Unknown error' };
        }
      }

      // Invalidate affected query keys
      queryKeysToInvalidate.forEach(keyStr => {
        try {
          const queryKey = JSON.parse(keyStr);
          queryClient.invalidateQueries({ queryKey });
        } catch (error) {
          console.warn('Failed to invalidate query key:', keyStr, error);
        }
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

      // Clear rollback manager
      rollbackManager.clear();

      return { success: true, results };

    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isRunning: false,
        failedOperations: [...prev.failedOperations, ...prev.operations.map(op => op.id)],
      }));

      toast({
        title: 'Transaction Error',
        description: `Transaction failed: ${error.message || 'Unknown error'}`,
        variant: 'destructive',
      });

      return { success: false, results: [], error: error.message || 'Unknown error' };
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
