
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTenantContext } from '@/contexts/TenantContext';

export interface FormOption {
  id: string;
  label: string;
  description?: string;
  visibility_scope: string;
  tenant_id?: string;
}

export const useAvailableFormOptions = () => {
  const { selectedTenantId } = useTenantContext();

  return useQuery({
    queryKey: ['available-form-options', selectedTenantId],
    queryFn: async () => {
      let query = supabase
        .from('form_definitions')
        .select('id, name, description, visibility_scope, tenant_id')
        .eq('is_active', true)
        .order('name');

      // Filter based on tenant context
      if (selectedTenantId) {
        // If a tenant is selected, show both global forms and tenant-specific forms for that tenant
        query = query.or(`tenant_id.is.null,tenant_id.eq.${selectedTenantId}`);
      } else {
        // If no tenant selected, show only global forms
        query = query.is('tenant_id', null);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching form options:', error);
        throw error;
      }

      // Transform to FormOption format
      const formOptions: FormOption[] = data.map(form => ({
        id: form.id,
        label: form.name,
        description: form.description || undefined,
        visibility_scope: form.visibility_scope,
        tenant_id: form.tenant_id || undefined
      }));

      return formOptions;
    },
  });
};
