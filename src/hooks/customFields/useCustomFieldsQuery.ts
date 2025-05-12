import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CustomField {
  id: string;
  tenant_id: string;
  name: string;
  field_key: string;
  field_type: string;
  required: boolean;
  applicable_forms?: string[];
  options?: Record<string, any>;
  description?: string;
}

export const useCustomFieldsQuery = (tenantId: string, formContext?: string) => {
  return useQuery({
    queryKey: ['customFields', tenantId, formContext],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('custom_fields')
        .select('*')
        .eq('tenant_id', tenantId)
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
