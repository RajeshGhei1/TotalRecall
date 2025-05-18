
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CustomField } from './types';

interface UseCustomFieldsListOptions {
  formContext?: string;
}

interface UseCustomFieldsListResult {
  customFields: CustomField[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching and managing custom fields
 */
export function useCustomFieldsList(
  tenantId?: string, 
  options?: UseCustomFieldsListOptions
): UseCustomFieldsListResult {
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const formContext = options?.formContext;

  const fetchCustomFields = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
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
        id: field.id,
        name: field.name,
        field_key: field.field_key,
        field_type: field.field_type,
        required: field.required,
        description: field.description,
        options: field.options as Record<string, any>,
        applicable_forms: field.applicable_forms as string[] | null,
        tenant_id: field.tenant_id,
        created_at: field.created_at,
        updated_at: field.updated_at,
        sort_order: field.sort_order || 0 // Ensure sort_order has a default value
      })) || [];
      
      setCustomFields(typedFields);
    } catch (err) {
      console.error('Error fetching custom fields:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCustomFields();
  }, [tenantId, formContext]);

  return {
    customFields,
    isLoading,
    error,
    refetch: fetchCustomFields
  };
}
