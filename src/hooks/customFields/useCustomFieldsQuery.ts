import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CustomField } from './types';

export const useCustomFieldsQuery = (tenantId: string, formContext?: string) => {
  return useQuery({
    queryKey: ['customFields', tenantId, formContext],
    queryFn: async () => {
      // Handle special case for "global" tenant
      if (tenantId === 'global') {
        const { data, error } = await supabase
          .from('custom_fields')
          .select('*')
          .is('tenant_id', null)
          .order('sort_order', { ascending: true })
          .order('name');
          
        if (error) {
          console.error('Error fetching global custom fields:', error);
          throw error;
        }
        
        let fields = data as CustomField[];

        // If a formContext is specified, filter fields to only those applicable to this form
        if (formContext) {
          fields = fields.filter(field => {
            // If applicable_forms is empty array or null, field applies to all forms
            if (!field.applicable_forms || field.applicable_forms.length === 0) {
              return true;
            }
            // Otherwise, check if this form is in the applicable_forms array
            return field.applicable_forms.includes(formContext);
          });
        }
        
        return fields;
      }
      
      // Regular tenant case
      const { data, error } = await supabase
        .from('custom_fields')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('sort_order', { ascending: true })
        .order('name');

      if (error) throw error;
      
      // If a formContext is specified, filter fields to only those applicable to this form
      let fields = data as CustomField[];
      if (formContext) {
        fields = fields.filter(field => {
          // If applicable_forms is empty array or null, field applies to all forms
          if (!field.applicable_forms || field.applicable_forms.length === 0) {
            return true;
          }
          // Otherwise, check if this form is in the applicable_forms array
          return field.applicable_forms.includes(formContext);
        });
      }
      
      return fields;
    },
  });
};

export type { CustomField };
