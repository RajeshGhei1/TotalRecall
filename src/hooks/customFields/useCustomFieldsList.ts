
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CustomField, UseCustomFieldsOptions } from './types';

/**
 * Hook to fetch and filter custom fields
 */
export const useCustomFieldsList = (tenantId?: string, options?: UseCustomFieldsOptions) => {
  const formContext = options?.formContext;

  const { data: customFields = [], isLoading, error, refetch } = useQuery({
    queryKey: ['customFields', tenantId, formContext],
    queryFn: async () => {
      let query = supabase
        .from('custom_fields')
        .select('*');

      // Filter by tenant_id if provided
      if (tenantId) {
        query = query.eq('tenant_id', tenantId);
      } else {
        query = query.is('tenant_id', null);
      }

      // Order by sort_order if the column exists
      query = query.order('sort_order', { ascending: true });

      const { data, error } = await query;

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

      // Map the database fields to our CustomField type
      return filteredFields.map(field => ({
        ...field,
        sort_order: field.sort_order || 0, // Ensure sort_order exists
        options: typeof field.options === 'string' ? JSON.parse(field.options) : field.options,
        applicable_forms: typeof field.applicable_forms === 'string' 
          ? JSON.parse(field.applicable_forms) 
          : field.applicable_forms
      } as CustomField));
    },
    enabled: true,
  });

  return { customFields, isLoading, error, refetch };
};
