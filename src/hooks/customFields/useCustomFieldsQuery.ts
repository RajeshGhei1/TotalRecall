
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CustomField } from './types';

/**
 * Hook for querying custom fields using React Query
 */
export function useCustomFieldsQuery(tenantId?: string, formContext?: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['customFields', tenantId, formContext],
    queryFn: async () => {
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

      // Order by sort_order if available, then by creation date
      query = query.order('sort_order', { ascending: true })
                  .order('created_at', { ascending: true });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Convert the result to the CustomField type
      const typedFields: CustomField[] = data?.map(field => ({
        ...field,
        // Ensure all required fields have values
        sort_order: field.sort_order || 0,
        description: field.description || '',
        options: field.options || {},
        applicable_forms: field.applicable_forms as string[] | null
      })) || [];
      
      return typedFields;
    },
  });

  return {
    fields: data || [],
    isLoading,
    error,
    refetch,
  };
}
