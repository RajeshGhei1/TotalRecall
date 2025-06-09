
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
      // Ensure required fields are present
      const moduleToCreate = {
        name: moduleData.name || '',
        category: moduleData.category || 'core',
        is_active: moduleData.is_active ?? true,
        description: moduleData.description,
        version: moduleData.version,
        dependencies: moduleData.dependencies,
        default_limits: moduleData.default_limits
      };

      const { data, error } = await supabase
        .from('system_modules')
        .insert(moduleToCreate)
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
      // Only include fields that are being updated
      const updateData: Partial<SystemModule> = {};
      
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.is_active !== undefined) updateData.is_active = updates.is_active;
      if (updates.version !== undefined) updateData.version = updates.version;
      if (updates.dependencies !== undefined) updateData.dependencies = updates.dependencies;
      if (updates.default_limits !== undefined) updateData.default_limits = updates.default_limits;

      const { data, error } = await supabase
        .from('system_modules')
        .update(updateData)
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
