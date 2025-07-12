
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface GlobalSetting {
  id: string;
  setting_key: string;
  setting_value: unknown;
  setting_type: 'string' | 'number' | 'boolean' | 'json';
  category: string;
  description?: string;
  is_sensitive: boolean;
  created_at: string;
  updated_at: string;
}

export const useGlobalSettings = (category?: string) => {
  return useQuery({
    queryKey: ['global-settings', category],
    queryFn: async () => {
      let query = supabase
        .from('global_settings')
        .select('*')
        .order('setting_key');

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Fix: Don't double-parse jsonb values - they're already parsed by Supabase
      return data.map(setting => ({
        ...setting,
        setting_value: setting.setting_value // Direct access, no JSON.parse needed
      })) as GlobalSetting[];
    },
  });
};

export const useUpdateGlobalSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      setting_value, 
      updated_by 
    }: { 
      id: string; 
      setting_value: unknown; 
      updated_by: string;
    }) => {
      const { data, error } = await supabase
        .from('global_settings')
        .update({
          setting_value: setting_value, // Store directly as jsonb, no stringify needed
          updated_by,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['global-settings'] });
    },
    onError: (error) => {
      console.error('Failed to update global setting:', error);
      throw error; // Re-throw to be handled by caller
    },
  });
};

export const useCreateGlobalSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (setting: Omit<GlobalSetting, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('global_settings')
        .insert({
          ...setting,
          setting_value: setting.setting_value // Store directly as jsonb
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['global-settings'] });
    },
    onError: (error) => {
      console.error('Failed to create global setting:', error);
      throw error; // Re-throw to be handled by caller
    },
  });
};
