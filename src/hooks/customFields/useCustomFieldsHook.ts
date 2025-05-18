
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
  const { customFields, isLoading, error, refetch } = useCustomFieldsList(tenantId, options);
  const { getCustomFieldValues, saveCustomFieldValues } = useCustomFieldValues();
  const { updateFieldOrder } = useFieldOrder(refetch);

  return {
    customFields,
    isLoading,
    getCustomFieldValues,
    saveCustomFieldValues,
    updateFieldOrder
  };
}
