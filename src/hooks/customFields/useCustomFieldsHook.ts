
import { useCustomFieldsList } from './useCustomFieldsList';
import { useFieldOrder } from './useFieldOrder';
import { useCustomFieldValues } from './useCustomFieldValues';
import { CustomField, UseCustomFieldsOptions, UseCustomFieldsReturn } from './types';

/**
 * Hook for managing custom fields and their values
 */
export function useCustomFieldsHook(
  tenantId?: string,
  options?: UseCustomFieldsOptions
): UseCustomFieldsReturn {
  // Pass parameters as a single object to match the expected interface
  const params = tenantId ? { entityType: tenantId } : undefined;
  const { customFields, isLoading, error, refetch } = useCustomFieldsList(params);
  const { getCustomFieldValues, saveCustomFieldValues } = useCustomFieldValues();
  const { updateFieldOrder } = useFieldOrder();

  // Create a wrapper function that matches the expected interface
  // This function handles passing the customFields to the saveCustomFieldValues function
  const saveValuesWrapper = async (
    entityType: string, 
    entityId: string, 
    values: Record<string, any>
  ): Promise<void> => {
    await saveCustomFieldValues(entityType, entityId, values, customFields);
  };

  return {
    customFields,
    isLoading,
    getCustomFieldValues,
    saveCustomFieldValues: saveValuesWrapper,
    updateFieldOrder: (fields: CustomField[], tenantId?: string, formContext?: string) => 
      updateFieldOrder(fields, tenantId, typeof formContext === 'string')
  };
}
