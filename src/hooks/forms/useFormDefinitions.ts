
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface FormDefinition {
  id: string;
  name: string;
  description?: string;
  tenant_id: string;
  is_active: boolean;
  access_level: string;
  created_at: string;
  updated_at: string;
}

export const useFormDefinitions = (tenantId: string) => {
  return useQuery({
    queryKey: ['form-definitions', tenantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('form_definitions')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as FormDefinition[];
    },
    enabled: !!tenantId,
  });
};
