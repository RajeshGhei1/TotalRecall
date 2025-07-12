
import { useState, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface OptimisticUpdate<T> {
  id: string;
  queryKey: unknown[];
  previousData: T | undefined;
  newData: T;
  timestamp: number;
  operation: 'create' | 'update' | 'delete';
}

interface OptimisticState<T> {
  pendingUpdates: Map<string, OptimisticUpdate<T>>;
  rollbackStack: OptimisticUpdate<T>[];
}

/**
 * Hook for optimistic updates with rollback capabilities
 */
export const useOptimisticUpdates = <T = any>() => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [state, setState] = useState<OptimisticState<T>>({
    pendingUpdates: new Map(),
    rollbackStack: [],
  });
  
  const updateIdCounter = useRef(0);

  // Apply optimistic update
  const applyOptimisticUpdate = useCallback((
    queryKey: unknown[],
    updater: (oldData: T | undefined) => T,
    operation: 'create' | 'update' | 'delete' = 'update'
  ) => {
    const updateId = `optimistic-${++updateIdCounter.current}`;
    const previousData = queryClient.getQueryData<T>(queryKey);
    const newData = updater(previousData);

    // Store the update for potential rollback
    const update: OptimisticUpdate<T> = {
      id: updateId,
      queryKey,
      previousData,
      newData,
      timestamp: Date.now(),
      operation,
    };

    setState(prev => ({
      pendingUpdates: new Map(prev.pendingUpdates).set(updateId, update),
      rollbackStack: [update, ...prev.rollbackStack.slice(0, 9)], // Keep last 10
    }));

    // Apply optimistic update to React Query cache
    queryClient.setQueryData(queryKey, newData);

    return updateId;
  }, [queryClient]);

  // Confirm optimistic update (remove from pending)
  const confirmOptimisticUpdate = useCallback((updateId: string) => {
    setState(prev => {
      const newPendingUpdates = new Map(prev.pendingUpdates);
      newPendingUpdates.delete(updateId);
      
      return {
        ...prev,
        pendingUpdates: newPendingUpdates,
      };
    });
  }, []);

  // Rollback specific update
  const rollbackUpdate = useCallback((updateId: string) => {
    const update = state.pendingUpdates.get(updateId);
    if (!update) return false;

    // Restore previous data
    queryClient.setQueryData(update.queryKey, update.previousData);

    // Remove from pending and add success message
    confirmOptimisticUpdate(updateId);
    
    toast({
      title: 'Change Rolled Back',
      description: `${update.operation} operation has been undone`,
    });

    return true;
  }, [state.pendingUpdates, queryClient, confirmOptimisticUpdate, toast]);

  // Rollback last update
  const rollbackLastUpdate = useCallback(() => {
    const lastUpdate = state.rollbackStack[0];
    if (!lastUpdate) return false;

    return rollbackUpdate(lastUpdate.id);
  }, [state.rollbackStack, rollbackUpdate]);

  // Rollback all pending updates
  const rollbackAllUpdates = useCallback(() => {
    let rolledBackCount = 0;
    
    state.pendingUpdates.forEach((update, updateId) => {
      queryClient.setQueryData(update.queryKey, update.previousData);
      rolledBackCount++;
    });

    setState({
      pendingUpdates: new Map(),
      rollbackStack: [],
    });

    if (rolledBackCount > 0) {
      toast({
        title: 'All Changes Rolled Back',
        description: `${rolledBackCount} pending changes have been undone`,
      });
    }

    return rolledBackCount;
  }, [state.pendingUpdates, queryClient, toast]);

  // Check if there are pending updates
  const hasPendingUpdates = state.pendingUpdates.size > 0;

  return {
    applyOptimisticUpdate,
    confirmOptimisticUpdate,
    rollbackUpdate,
    rollbackLastUpdate,
    rollbackAllUpdates,
    hasPendingUpdates,
    pendingUpdates: Array.from(state.pendingUpdates.values()),
    rollbackStack: state.rollbackStack,
  };
};
