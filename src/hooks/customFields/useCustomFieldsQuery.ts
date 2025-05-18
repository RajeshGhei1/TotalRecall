
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CustomField } from './types';

export function useCustomFieldsQuery(tenantId?: string, formContext?: string) {
  // Query to fetch custom fields
  const { data: fields = [], isLoading, error, refetch } = useQuery({
    queryKey: ['custom-fields', tenantId, formContext],
    queryFn: async () => {
      // Build the query
      let query = supabase.from('custom_fields').select('*');
      
      // Filter by tenant if provided
      if (tenantId) {
        if (tenantId === 'global') {
          query = query.is('tenant_id', null);
        } else {
          query = query.eq('tenant_id', tenantId);
        }
      }
      
      // Filter by form context if provided
      if (formContext) {
        query = query.or(`applicable_forms.cs.{${formContext}},applicable_forms.eq.[]`);
      }
      
      // Order by sort_order, then by creation date
      query = query
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching custom fields:', error);
        throw error;
      }
      
      // Convert the result to the CustomField type with sort_order
      return (data || []).map(field => ({
        ...field,
        sort_order: field.sort_order || 0 // Ensure sort_order has a default value
      })) as CustomField[];
    }
  });

  return {
    fields,
    isLoading,
    error,
    refetch
  };
}
