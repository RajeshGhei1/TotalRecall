
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CustomField } from './types';

/**
 * Hook for querying custom fields using React Query
 * Supports multi-level architecture:
 * - Super Admin (global): See only global fields (tenant_id = null)
 * - Tenant Admin/Users: See both global fields AND tenant-specific fields
 */
export function useCustomFieldsQuery(tenantId?: string, formContext?: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['customFields', tenantId, formContext],
    queryFn: async () => {
      try {
        // Define the query base
        let query = supabase
          .from('custom_fields')
          .select('*');
        
        // Enhanced tenant filter logic to support multi-level architecture
        if (tenantId) {
          if (tenantId === 'global') {
            // Super Admin: Only see global fields (tenant_id = null)
            query = query.is('tenant_id', null);
          } else {
            // Tenant Admin/Users: See BOTH global AND tenant-specific fields
            query = query.or(`tenant_id.is.null,tenant_id.eq.${tenantId}`);
          }
        } else {
          // No tenant specified: default to global fields only
          query = query.is('tenant_id', null);
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
        
        // Convert the result to the CustomField type and add scope information
        const typedFields: CustomField[] = (data || []).map((field, index) => {
          // Handle options parsing safely
          let parsedOptions: unknown;
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
          let applicableForms: string[] | null;
          if (typeof field.applicable_forms === 'string') {
            try {
              applicableForms = JSON.parse(field.applicable_forms);
            } catch (e) {
              applicableForms = [];
            }
          } else {
            applicableForms = field.applicable_forms as string[] || null;
          }
          
          // Determine field scope for UI display
          const isGlobalField = field.tenant_id === null;
          const fieldScope = isGlobalField ? 'global' : 'tenant';
          
          return {
            ...field,
            id: field.id,
            name: field.name,
            field_key: field.field_key,
            field_type: field.field_type,
            required: field.required || false,
            tenant_id: field.tenant_id,
            // Add sort_order with index fallback
            sort_order: 'sort_order' in field ? field.sort_order : index,
            description: field.description || '',
            options: parsedOptions,
            applicable_forms: applicableForms,
            created_at: field.created_at,
            updated_at: field.updated_at,
            // Add scope metadata for UI differentiation
            field_scope: fieldScope,
            is_global: isGlobalField
          } as CustomField;
        });
        
        // Sort fields with global fields first, then tenant-specific
        const sortedFields = typedFields.sort((a, b) => {
          // Global fields come first
          if (a.is_global && !b.is_global) return -1;
          if (!a.is_global && b.is_global) return 1;
          // Then by sort_order
          return (a.sort_order || 0) - (b.sort_order || 0);
        });
        
        return sortedFields;
      } catch (error) {
        console.error("Error in useCustomFieldsQuery:", error);
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
