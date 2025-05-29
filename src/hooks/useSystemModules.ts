
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SystemModule {
  id: string;
  name: string;
  description?: string;
  category: string;
  is_active: boolean;
  version?: string;
  dependencies?: string[];
  default_limits?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export const useSystemModules = (activeOnly: boolean = true) => {
  return useQuery({
    queryKey: ['system-modules', activeOnly],
    queryFn: async () => {
      let query = supabase
        .from('system_modules')
        .select('*')
        .order('name');

      if (activeOnly) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching system modules:', error);
        throw error;
      }

      return data as SystemModule[];
    },
  });
};

export const useSystemModuleById = (moduleId: string) => {
  return useQuery({
    queryKey: ['system-module', moduleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_modules')
        .select('*')
        .eq('id', moduleId)
        .single();

      if (error) {
        console.error('Error fetching system module:', error);
        throw error;
      }

      return data as SystemModule;
    },
    enabled: !!moduleId,
  });
};
