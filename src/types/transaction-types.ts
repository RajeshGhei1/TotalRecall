
export interface TransactionOperation {
  id: string;
  type: 'insert' | 'update' | 'delete';
  table: string;
  data?: Record<string, any>;
  filter?: Record<string, any>;
  queryKey?: unknown[]; // For query invalidation
}

export interface RollbackOperation {
  type: 'insert' | 'update' | 'delete';
  table: string;
  data?: Record<string, any>;
  filter?: Record<string, any>;
}

export interface TransactionState {
  isRunning: boolean;
  operations: TransactionOperation[];
  completedOperations: string[];
  failedOperations: string[];
}

export interface TransactionResult {
  success: boolean;
  results: unknown[];
  error?: string;
}
