
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['system-modules', activeOnly],
    queryFn: async () => {
      let queryBuilder = supabase
        .from('system_modules')
        .select('*')
        .order('name');

      if (activeOnly) {
        queryBuilder = queryBuilder.eq('is_active', true);
      }

      const { data, error } = await queryBuilder;

      if (error) {
        console.error('Error fetching system modules:', error);
        throw error;
      }

      return data as SystemModule[];
    },
  });

  const createModule = useMutation({
    mutationFn: async (moduleData: Partial<SystemModule>) => {
      const { data, error } = await supabase
        .from('system_modules')
        .insert(moduleData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-modules'] });
    },
  });

  const updateModule = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<SystemModule> }) => {
      const { data, error } = await supabase
        .from('system_modules')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-modules'] });
    },
  });

  const deleteModule = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('system_modules')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-modules'] });
    },
  });

  return {
    ...query,
    createModule,
    updateModule,
    deleteModule
  };
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
