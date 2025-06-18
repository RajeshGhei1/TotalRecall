
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
  maturity_status?: 'planning' | 'alpha' | 'beta' | 'production';
  development_stage?: Record<string, any>;
  promoted_to_production_at?: string;
  promoted_by?: string;
}

export const useSystemModules = (activeOnly: boolean = true, maturityFilter?: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['system-modules', activeOnly, maturityFilter],
    queryFn: async () => {
      console.log('Fetching modules with filter:', maturityFilter);
      
      let queryBuilder = supabase
        .from('system_modules')
        .select('*')
        .order('name');

      if (activeOnly) {
        queryBuilder = queryBuilder.eq('is_active', true);
      }

      if (maturityFilter) {
        if (maturityFilter === 'production') {
          queryBuilder = queryBuilder.eq('maturity_status', 'production');
        } else if (maturityFilter === 'development') {
          queryBuilder = queryBuilder.in('maturity_status', ['planning', 'alpha', 'beta']);
        }
      }

      const { data, error } = await queryBuilder;

      if (error) {
        console.error('Error fetching system modules:', error);
        throw error;
      }

      console.log('Fetched modules:', data?.length, data?.map(m => ({ 
        name: m.name, 
        maturity_status: m.maturity_status, 
        development_stage: m.development_stage 
      })));

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
        default_limits: moduleData.default_limits,
        maturity_status: moduleData.maturity_status || 'planning',
        development_stage: moduleData.development_stage || {
          stage: 'planning',
          progress: 0,
          milestones: [],
          requirements: []
        }
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
      if (updates.maturity_status !== undefined) updateData.maturity_status = updates.maturity_status;
      if (updates.development_stage !== undefined) updateData.development_stage = updates.development_stage;

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

  const promoteToProduction = useMutation({
    mutationFn: async (moduleId: string) => {
      const { data, error } = await supabase
        .from('system_modules')
        .update({
          maturity_status: 'production',
          promoted_to_production_at: new Date().toISOString(),
          promoted_by: (await supabase.auth.getUser()).data.user?.id,
          development_stage: {
            stage: 'production',
            progress: 100,
            milestones: ['requirements_defined', 'development_complete', 'testing_complete', 'production_ready'],
            requirements: []
          }
        })
        .eq('id', moduleId)
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
    promoteToProduction,
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
