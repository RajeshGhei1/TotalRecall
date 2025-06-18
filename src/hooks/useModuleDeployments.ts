
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ModuleDeployment {
  id: string;
  module_name: string;
  version: string;
  deployment_type: 'install' | 'update' | 'rollback' | 'uninstall';
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'rolled_back';
  tenant_id?: string;
  deployed_by?: string;
  deployment_config: Record<string, any>;
  deployment_log: any[];
  error_message?: string;
  started_at: string;
  completed_at?: string;
  rolled_back_at?: string;
  created_at: string;
  updated_at: string;
}

export const useModuleDeployments = (tenantId?: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['module-deployments', tenantId],
    queryFn: async () => {
      let queryBuilder = supabase
        .from('module_deployments')
        .select('*')
        .order('started_at', { ascending: false });

      if (tenantId) {
        queryBuilder = queryBuilder.eq('tenant_id', tenantId);
      }

      const { data, error } = await queryBuilder;

      if (error) {
        console.error('Error fetching module deployments:', error);
        throw error;
      }

      return (data || []).map((deployment: any) => ({
        ...deployment,
        deployment_config: deployment.deployment_config || {},
        deployment_log: Array.isArray(deployment.deployment_log) ? deployment.deployment_log : []
      })) as ModuleDeployment[];
    },
  });

  const createDeployment = useMutation({
    mutationFn: async (deploymentData: Partial<ModuleDeployment>) => {
      const { data, error } = await supabase
        .from('module_deployments')
        .insert({
          module_name: deploymentData.module_name,
          version: deploymentData.version,
          deployment_type: deploymentData.deployment_type || 'install',
          status: 'pending',
          tenant_id: deploymentData.tenant_id,
          deployed_by: deploymentData.deployed_by,
          deployment_config: deploymentData.deployment_config || {},
          deployment_log: []
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['module-deployments'] });
    },
  });

  const updateDeployment = useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      error_message, 
      deployment_log 
    }: { 
      id: string; 
      status?: string; 
      error_message?: string; 
      deployment_log?: any[] 
    }) => {
      const updates: any = {};
      
      if (status) {
        updates.status = status;
        if (status === 'completed') {
          updates.completed_at = new Date().toISOString();
        } else if (status === 'rolled_back') {
          updates.rolled_back_at = new Date().toISOString();
        }
      }
      
      if (error_message !== undefined) {
        updates.error_message = error_message;
      }
      
      if (deployment_log) {
        updates.deployment_log = deployment_log;
      }

      const { data, error } = await supabase
        .from('module_deployments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['module-deployments'] });
    },
  });

  return {
    ...query,
    createDeployment,
    updateDeployment
  };
};

export const useModuleDeploymentById = (deploymentId: string) => {
  return useQuery({
    queryKey: ['module-deployment', deploymentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('module_deployments')
        .select('*')
        .eq('id', deploymentId)
        .single();

      if (error) {
        console.error('Error fetching module deployment:', error);
        throw error;
      }

      return {
        ...data,
        deployment_config: data.deployment_config || {},
        deployment_log: Array.isArray(data.deployment_log) ? data.deployment_log : []
      } as ModuleDeployment;
    },
    enabled: !!deploymentId,
  });
};
