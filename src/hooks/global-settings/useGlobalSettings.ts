
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface GlobalSetting {
  id: string;
  setting_key: string;
  setting_value: any;
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

      // Parse JSON values based on setting_type
      return data.map(setting => ({
        ...setting,
        setting_value: setting.setting_type === 'json' 
          ? setting.setting_value 
          : JSON.parse(String(setting.setting_value))
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
      setting_value: any; 
      updated_by: string;
    }) => {
      const { data, error } = await supabase
        .from('global_settings')
        .update({
          setting_value: JSON.stringify(setting_value),
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
      toast({
        title: 'Setting Updated',
        description: 'Global setting has been updated successfully.',
      });
    },
    onError: (error) => {
      console.error('Failed to update global setting:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to update global setting. Please try again.',
        variant: 'destructive',
      });
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
          setting_value: JSON.stringify(setting.setting_value)
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['global-settings'] });
      toast({
        title: 'Setting Created',
        description: 'New global setting has been created successfully.',
      });
    },
    onError: (error) => {
      console.error('Failed to create global setting:', error);
      toast({
        title: 'Creation Failed',
        description: 'Failed to create global setting. Please try again.',
        variant: 'destructive',
      });
    },
  });
};
