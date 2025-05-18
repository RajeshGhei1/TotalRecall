import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CustomField } from './types';

/**
 * Hook for querying custom fields (Legacy version - might be deprecated)
 */
export function useCustomFieldsLegacy(tenantId?: string, formContext?: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['customFieldsLegacy', tenantId, formContext],
    queryFn: async () => {
      try {
        let query = supabase
          .from('custom_fields')
          .select('*');

        // Filter by tenant_id if provided
        if (tenantId) {
          if (tenantId === 'global') {
            query = query.is('tenant_id', null);
          } else {
            query = query.eq('tenant_id', tenantId);
          }
        } else {
          query = query.is('tenant_id', null);
        }

        // Check if the sort_order column exists
        const { data: columns, error: columnsError } = await supabase
          .from('custom_fields')
          .select('sort_order')
          .limit(1);

        let orderQuery = query;
        // Only order by sort_order if the column exists
        if (columns && !columnsError) {
          // The column exists, we can use it for ordering
          orderQuery = query.order('sort_order', { ascending: true });
        }

        // Always add a secondary ordering by creation date
        orderQuery = orderQuery.order('created_at', { ascending: true });

        const { data, error } = await orderQuery;

        if (error) throw error;

        // Filter by form context if provided
        let filteredFields = data || [];
        if (formContext) {
          filteredFields = filteredFields.filter(field => {
            // Check if the field has applicable_forms that include the formContext
            if (!field.applicable_forms) return false;

            // The applicable_forms field is a JSON array in the database
            let applicableForms: string[] = [];

            try {
              if (typeof field.applicable_forms === 'string') {
                applicableForms = JSON.parse(field.applicable_forms);
              } else if (Array.isArray(field.applicable_forms)) {
                applicableForms = field.applicable_forms as string[];
              } else if (field.applicable_forms !== null) {
                // Handle case where applicable_forms is a JSON object
                const formsObj = field.applicable_forms as Record<string, any>;
                if (formsObj.hasOwnProperty('forms')) {
                  applicableForms = formsObj.forms as string[];
                }
              }
            } catch (e) {
              console.error('Error parsing applicable_forms:', e);
            }

            return applicableForms.includes(formContext);
          });
        }

        return processFields(filteredFields);
      } catch (error) {
        console.error("Error in useCustomFieldsLegacy:", error);
        throw error;
      }
    },
  });

  return {
    fields: data || [],
    isLoading,
    error,
    refetch,
  };
}

// Helper function to process the fields
const processFields = (data) => {
  return (data || []).map((field, index) => {
    // Make sure to handle sort_order properly
    const fieldWithSortOrder = {
      ...field,
      sort_order: 'sort_order' in field ? field.sort_order : index
    };
    
    // Handle options
    let parsedOptions;
    if (typeof field.options === 'string') {
      try {
        parsedOptions = JSON.parse(field.options);
      } catch (e) {
        parsedOptions = {};
      }
    } else {
      parsedOptions = field.options || {};
    }
    
    // Handle applicable_forms
    let applicableForms;
    if (typeof field.applicable_forms === 'string') {
      try {
        applicableForms = JSON.parse(field.applicable_forms);
      } catch (e) {
        applicableForms = [];
      }
    } else {
      applicableForms = field.applicable_forms || [];
    }
    
    return {
      ...fieldWithSortOrder,
      options: parsedOptions,
      applicable_forms: applicableForms
    } as CustomField;
  });
};
