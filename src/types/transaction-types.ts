
export interface TransactionOperation {
  id: string;
  type: 'insert' | 'update' | 'delete';
  table: string;
  data?: Record<string, any>;
  filter?: Record<string, any>;
}

export interface RollbackOperation {
  type: 'insert' | 'update' | 'delete';
  table: string;
  data?: Record<string, any>;
  filter?: Record<string, any>;
}
