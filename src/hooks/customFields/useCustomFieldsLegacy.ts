
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CustomField, UseCustomFieldsOptions, UseCustomFieldsReturn } from './types';
import { useCustomFieldValues } from './useCustomFieldValues';
import { useFieldOrder } from './useFieldOrder';
import { Json } from '@/integrations/supabase/types';

/**
 * Legacy hook for custom fields functionality
 * Kept for backward compatibility
 */
export const useCustomFieldsLegacy = (tenantId?: string, options?: UseCustomFieldsOptions): UseCustomFieldsReturn => {
  const { getCustomFieldValues, saveCustomFieldValues } = useCustomFieldValues();
  const { updateFieldOrder } = useFieldOrder();
  
  const formContext = options?.formContext;

  // Query for custom fields
  const { data, isLoading, error } = useQuery({
    queryKey: ['customFields', tenantId, formContext],
    queryFn: async () => {
      try {
        // Define the query base
        let query = supabase
          .from('custom_fields')
          .select('*');
        
        // Add tenant filter if provided
        if (tenantId) {
          if (tenantId === 'global') {
            // For global, get fields where tenant_id is null
            query = query.is('tenant_id', null);
          } else {
            // For specific tenant
            query = query.eq('tenant_id', tenantId);
          }
        }
        
        // Add form context filter if provided
        if (formContext) {
          // We need to check if 'formContext' is in the applicable_forms array or if applicable_forms is empty
          query = query.or(`applicable_forms.cs.{${formContext}},applicable_forms.eq.[]`);
        }
        
        // Check if sort_order column exists
        const { data: columns, error: columnsError } = await supabase
          .from('custom_fields')
          .select('sort_order')
          .limit(1);

        // Only order by sort_order if the column exists
        if (columns && !columnsError) {
          query = query.order('sort_order', { ascending: true });
        }
        
        // Always add a secondary ordering by creation date
        query = query.order('created_at', { ascending: true });
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        // Convert the result to the CustomField type
        const typedFields = (data || []).map((field, index) => {
          // Handle options parsing safely
          let parsedOptions;
          if (typeof field.options === 'string') {
            try {
              parsedOptions = JSON.parse(field.options);
            } catch (e) {
              parsedOptions = field.options;
            }
          } else {
            parsedOptions = field.options || {};
          }
          
          // Handle applicable_forms parsing
          let applicableForms;
          if (typeof field.applicable_forms === 'string') {
            try {
              applicableForms = JSON.parse(field.applicable_forms);
            } catch (e) {
              applicableForms = [];
            }
          } else {
            applicableForms = field.applicable_forms as string[] || null;
          }
          
          return {
            ...field,
            id: field.id,
            name: field.name,
            field_key: field.field_key,
            field_type: field.field_type,
            required: field.required || false,
            tenant_id: field.tenant_id,
            // Add sort_order with index fallback
            // Use hasOwnProperty to safely check if sort_order exists
            sort_order: 'sort_order' in field ? field.sort_order : index,
            description: field.description || '',
            options: parsedOptions,
            applicable_forms: applicableForms,
            created_at: field.created_at,
            updated_at: field.updated_at
          } as CustomField;
        });
        
        return typedFields;
      } catch (error) {
        console.error("Error in useCustomFields:", error);
        throw error;
      }
    },
  });

  // Create a wrapper function that converts the third parameter to match expected signature
  const updateFieldOrderWrapper = (
    fields: CustomField[], 
    tenantId?: string, 
    formContext?: string
  ): Promise<any> => {
    // Convert formContext to boolean for showToast parameter
    // If formContext is a string, we'll use true for showToast
    const showToast = typeof formContext === 'string';
    return updateFieldOrder(fields, tenantId, showToast);
  };

  return {
    customFields: data || [],
    isLoading,
    getCustomFieldValues,
    saveCustomFieldValues,
    updateFieldOrder: updateFieldOrderWrapper
  };
};

// Export legacy hook
export { useCustomFieldsLegacy as useCustomFields };
