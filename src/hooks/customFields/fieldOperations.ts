
// Re-export operations from separate files
import { createCustomField } from './operations/createCustomField';
import { updateCustomField } from './operations/updateCustomField';
import { deleteCustomField } from './operations/deleteCustomField';
import { saveCustomFieldValues } from './operations/saveCustomFieldValues';

// Export operations for backward compatibility
export {
  createCustomField,
  updateCustomField,
  deleteCustomField,
  saveCustomFieldValues
};
