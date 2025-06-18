
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ModuleSetting {
  id: string;
  module_name: string;
  tenant_id?: string;
  setting_key: string;
  setting_value: any;
  setting_type: string;
  is_encrypted: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export const useModuleSettings = (moduleName: string, tenantId?: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['module-settings', moduleName, tenantId],
    queryFn: async () => {
      let queryBuilder = supabase
        .from('module_settings')
        .select('*')
        .eq('module_name', moduleName);

      if (tenantId) {
        queryBuilder = queryBuilder.eq('tenant_id', tenantId);
      }

      const { data, error } = await queryBuilder;

      if (error) {
        console.error('Error fetching module settings:', error);
        throw error;
      }

      return (data || []) as ModuleSetting[];
    },
    enabled: !!moduleName,
  });

  const setSetting = useMutation({
    mutationFn: async ({
      setting_key,
      setting_value,
      setting_type = 'string',
      is_encrypted = false
    }: {
      setting_key: string;
      setting_value: any;
      setting_type?: string;
      is_encrypted?: boolean;
    }) => {
      const { data, error } = await supabase
        .from('module_settings')
        .upsert({
          module_name: moduleName,
          tenant_id: tenantId,
          setting_key,
          setting_value,
          setting_type,
          is_encrypted
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['module-settings', moduleName, tenantId] });
    },
  });

  const deleteSetting = useMutation({
    mutationFn: async (setting_key: string) => {
      const { error } = await supabase
        .from('module_settings')
        .delete()
        .eq('module_name', moduleName)
        .eq('setting_key', setting_key)
        .eq('tenant_id', tenantId || '');

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['module-settings', moduleName, tenantId] });
    },
  });

  return {
    ...query,
    setSetting,
    deleteSetting
  };
};

export const useModuleSetting = (moduleName: string, settingKey: string, tenantId?: string) => {
  return useQuery({
    queryKey: ['module-setting', moduleName, settingKey, tenantId],
    queryFn: async () => {
      let queryBuilder = supabase
        .from('module_settings')
        .select('*')
        .eq('module_name', moduleName)
        .eq('setting_key', settingKey);

      if (tenantId) {
        queryBuilder = queryBuilder.eq('tenant_id', tenantId);
      }

      const { data, error } = await queryBuilder.maybeSingle();

      if (error) {
        console.error('Error fetching module setting:', error);
        throw error;
      }

      return data as ModuleSetting | null;
    },
    enabled: !!moduleName && !!settingKey,
  });
};
