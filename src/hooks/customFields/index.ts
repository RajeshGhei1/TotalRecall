import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchCustomFields, filterFieldsByFormContext, fetchCustomFieldValues } from './fetchHelpers';
import { saveCustomFieldValues } from './fieldOperations';
import { UseCustomFieldsOptions, UseCustomFieldsReturn, CustomField } from './types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook for managing custom fields and their values
 */
export function useCustomFields(tenantId?: string, options?: UseCustomFieldsOptions): UseCustomFieldsReturn {
  const queryClient = useQueryClient();
  const { formContext } = options || {};

  // Default to "global" if no tenantId is provided
  const effectiveTenantId = tenantId || "global";
  
  console.log(`Fetching custom fields for tenant: ${effectiveTenantId}, formContext: ${formContext || 'all'}`);

  // Fetch custom fields for a tenant
  const { data: customFields = [], isLoading } = useQuery({
    queryKey: ['customFields', effectiveTenantId, formContext],
    queryFn: async () => {
      const fields = await fetchCustomFields(effectiveTenantId);
      return formContext ? filterFieldsByFormContext(fields, formContext) : fields;
    },
    enabled: !!effectiveTenantId,
  });

  // Fetch custom field values for an entity
  const getCustomFieldValues = async (entityType: string, entityId: string) => {
    if (!entityId || !entityType) return [];
    
    const values = await fetchCustomFieldValues(entityType, entityId);
    
    // If formContext is provided, filter the values to only include fields applicable to this form
    if (formContext) {
      return values.filter(item => {
        const field = item.custom_fields;
        // If applicable_forms is empty array or null, field applies to all forms
        if (!field.applicable_forms || 
            (Array.isArray(field.applicable_forms) && field.applicable_forms.length === 0)) {
          return true;
        }
        // Otherwise, check if this form is in the applicable_forms array
        return Array.isArray(field.applicable_forms) && field.applicable_forms.includes(formContext);
      });
    }
    
    return values;
  };

  // Save custom field values
  const saveValues = async (entityType: string, entityId: string, values: Record<string, any>) => {
    await saveCustomFieldValues(
      queryClient, 
      effectiveTenantId, 
      entityType, 
      entityId, 
      values, 
      formContext
    );
  };

  // Update field order
  const updateFieldOrder = async (
    fields: CustomField[],
    tenantId: string = effectiveTenantId,
    formContext?: string
  ) => {
    try {
      // Prepare updates with all required fields
      const updates = fields.map((field, index) => ({
        id: field.id,
        sort_order: index,
        name: field.name, 
        field_key: field.field_key,
        field_type: field.field_type
      }));

      // Update all fields in one go
      const { data, error } = await supabase
        .from('custom_fields')
        .upsert(updates, { onConflict: 'id' });

      if (error) throw error;

      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: ['customFields', tenantId, formContext]
      });

      return data;
    } catch (error) {
      console.error('Error updating field order:', error);
      throw error;
    }
  };

  return {
    customFields,
    isLoading,
    getCustomFieldValues,
    saveCustomFieldValues: saveValues,
    updateFieldOrder
  };
}

// Export types
export * from './types';
