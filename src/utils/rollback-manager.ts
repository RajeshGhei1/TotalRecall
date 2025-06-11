
import type { RollbackOperation, TransactionOperation } from '@/types/transaction-types';
import { executeRollbackOperation, fetchCurrentData } from './transaction-operations';

export class RollbackManager {
  private rollbackOperations: RollbackOperation[] = [];

  async prepareRollback(operation: TransactionOperation, result: any): Promise<void> {
    try {
      switch (operation.type) {
        case 'insert':
          // For inserts, prepare to delete the created records
          if (result.data && Array.isArray(result.data) && result.data.length > 0) {
            const firstRecord = result.data[0] as Record<string, any>;
            if (firstRecord && 'id' in firstRecord && firstRecord.id != null) {
              this.rollbackOperations.push({
                type: 'delete',
                table: operation.table,
                filter: { id: firstRecord.id }
              });
            }
          }
          break;

        case 'update':
          // For updates, prepare to restore original data
          if (operation.filter) {
            const { data: currentData } = await fetchCurrentData(operation.table, operation.filter);
            if (currentData && currentData.length > 0) {
              this.rollbackOperations.push({
                type: 'update',
                table: operation.table,
                filter: operation.filter,
                data: currentData[0]
              });
            }
          }
          break;

        case 'delete':
          // For deletes, prepare to restore deleted data
          if (operation.filter) {
            const { data: currentData } = await fetchCurrentData(operation.table, operation.filter);
            if (currentData && Array.isArray(currentData) && currentData.length > 0) {
              this.rollbackOperations.push({
                type: 'insert',
                table: operation.table,
                data: currentData
              });
            }
          }
          break;
      }
    } catch (error) {
      console.warn('Failed to prepare rollback for operation:', operation.id, error);
    }
  }

  async executeRollback(): Promise<void> {
    console.log('Executing rollback operations...');
    
    // Execute rollback operations in reverse order
    for (let i = this.rollbackOperations.length - 1; i >= 0; i--) {
      const rollbackOp = this.rollbackOperations[i];
      try {
        await executeRollbackOperation(rollbackOp);
        console.log('Rollback operation completed:', rollbackOp);
      } catch (rollbackError) {
        console.error('Rollback operation failed:', rollbackOp, rollbackError);
      }
    }
  }

  clear(): void {
    this.rollbackOperations = [];
  }

  getOperationsCount(): number {
    return this.rollbackOperations.length;
  }
}
