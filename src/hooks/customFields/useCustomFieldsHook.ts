
import { useState } from 'react';
import { useCustomFieldsList } from './useCustomFieldsList';
import { useCustomFieldValues } from './useCustomFieldValues';
import { useFieldOrder } from './useFieldOrder';
import { UseCustomFieldsOptions, UseCustomFieldsReturn, CustomField } from './types';

/**
 * Combined hook for managing custom fields and their values
 */
export function useCustomFieldsHook(
  tenantId?: string, 
  options?: UseCustomFieldsOptions
): UseCustomFieldsReturn {
  const { customFields, isLoading, refetch } = useCustomFieldsList(tenantId, options);
  const { getCustomFieldValues: getValues, saveCustomFieldValues: saveValues } = useCustomFieldValues();
  const { updateFieldOrder } = useFieldOrder();
  
  // State for local fields (used when reordering)
  const [localFields, setLocalFields] = useState<CustomField[]>([]);
  
  // Use localFields if available, otherwise use the fetched customFields
  const fields = localFields.length > 0 ? localFields : customFields;
  
  /**
   * Get custom field values for an entity
   */
  const getCustomFieldValues = async (entityType: string, entityId: string) => {
    return await getValues(entityType, entityId);
  };
  
  /**
   * Save custom field values for an entity
   */
  const saveCustomFieldValues = async (entityType: string, entityId: string, values: Record<string, any>) => {
    await saveValues(entityType, entityId, values, fields);
  };
  
  /**
   * Update field order
   */
  const updateFieldsOrder = async (
    updatedFields: CustomField[], 
    tenantId?: string, 
    formContext?: string
  ) => {
    // Update local state first for immediate UI feedback
    setLocalFields(updatedFields);
    
    // Then update in the database
    await updateFieldOrder(updatedFields, tenantId);
    
    // Refetch to ensure we have the latest data
    await refetch();
    
    return true;
  };

  return {
    customFields: fields,
    isLoading,
    getCustomFieldValues,
    saveCustomFieldValues,
    updateFieldOrder: updateFieldsOrder
  };
}
