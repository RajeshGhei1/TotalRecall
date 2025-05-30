
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DashboardConfig {
  id: string;
  user_id: string;
  dashboard_name: string;
  layout_config: Record<string, any>;
  widget_configs: any[];
  filters: Record<string, any>;
  is_default: boolean;
  tenant_id?: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardWidget {
  id: string;
  widget_type: string;
  name: string;
  description?: string;
  category: string;
  config_schema: Record<string, any>;
  data_source_config: Record<string, any>;
  default_config: Record<string, any>;
  is_active: boolean;
}

export const useDashboardConfig = (configId?: string) => {
  return useQuery({
    queryKey: ['dashboard-config', configId],
    queryFn: async () => {
      if (!configId) return null;
      
      const { data, error } = await supabase
        .from('user_dashboard_configs')
        .select('*')
        .eq('id', configId)
        .single();

      if (error) throw error;
      return data as DashboardConfig;
    },
    enabled: !!configId,
  });
};

export const useUserDashboardConfigs = (userId?: string) => {
  return useQuery({
    queryKey: ['user-dashboard-configs', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_dashboard_configs')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false })
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data as DashboardConfig[];
    },
    enabled: !!userId,
  });
};

export const useDashboardWidgets = () => {
  return useQuery({
    queryKey: ['dashboard-widgets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dashboard_widgets')
        .select('*')
        .eq('is_active', true)
        .order('category')
        .order('name');

      if (error) throw error;
      return data as DashboardWidget[];
    },
  });
};

export const useCreateDashboardConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: Partial<DashboardConfig>) => {
      const { data, error } = await supabase
        .from('user_dashboard_configs')
        .insert(config)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-dashboard-configs'] });
    },
  });
};

export const useUpdateDashboardConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DashboardConfig> & { id: string }) => {
      const { data, error } = await supabase
        .from('user_dashboard_configs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-config', data.id] });
      queryClient.invalidateQueries({ queryKey: ['user-dashboard-configs'] });
    },
  });
};
