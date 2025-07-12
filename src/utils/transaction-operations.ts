
import { supabase } from '@/integrations/supabase/client';
import type { TransactionOperation, RollbackOperation } from '@/types/transaction-types';

// Type-safe wrapper that bypasses strict table name typing
const executeSupabaseOperation = async (operation: TransactionOperation) => {
  // Use type assertion to bypass strict typing for dynamic table names
  const client = supabase as unknown;
  
  switch (operation.type) {
    case 'insert':
      const insertQuery = client
        .from(operation.table)
        .insert(operation.data!)
        .select('*');
      
      return await insertQuery;

    case 'update':
      const updateQuery = client
        .from(operation.table)
        .update(operation.data!)
        .match(operation.filter!)
        .select('*');
      
      return await updateQuery;

    case 'delete':
      const deleteQuery = client
        .from(operation.table)
        .delete()
        .match(operation.filter!)
        .select('*');
      
      return await deleteQuery;

    default:
      throw new Error(`Unknown operation type: ${operation.type}`);
  }
};

const executeRollbackOperation = async (rollbackOp: RollbackOperation) => {
  const client = supabase as unknown;
  
  switch (rollbackOp.type) {
    case 'insert':
      return await client.from(rollbackOp.table).insert(rollbackOp.data!);
    case 'update':
      return await client.from(rollbackOp.table).update(rollbackOp.data!).match(rollbackOp.filter!);
    case 'delete':
      return await client.from(rollbackOp.table).delete().match(rollbackOp.filter!);
    default:
      throw new Error(`Unknown rollback operation type: ${rollbackOp.type}`);
  }
};

const fetchCurrentData = async (table: string, filter: Record<string, any>) => {
  const client = supabase as unknown;
  return await client
    .from(table)
    .select('*')
    .match(filter);
};

export { executeSupabaseOperation, executeRollbackOperation, fetchCurrentData };
