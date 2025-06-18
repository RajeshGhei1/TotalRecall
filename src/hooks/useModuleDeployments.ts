
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ModuleDeployment {
  id: string;
  module_name: string;
  version: string;
  deployment_type: string;
  status: string;
  tenant_id: string;
  deployed_by: string;
  started_at: string;
  completed_at?: string;
  deployment_config?: any;
  deployment_log?: any[];
}

export const useModuleDeployments = (tenantId?: string) => {
  return useQuery({
    queryKey: ['module-deployments', tenantId],
    queryFn: async (): Promise<ModuleDeployment[]> => {
      try {
        let query = supabase
          .from('module_deployments')
          .select('*')
          .order('started_at', { ascending: false })
          .limit(50);

        // Only filter by tenant_id if it's a valid UUID
        if (tenantId && isValidUUID(tenantId)) {
          query = query.eq('tenant_id', tenantId);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching module deployments:', error);
          return [];
        }

        return data || [];
      } catch (error) {
        console.error('Error in useModuleDeployments:', error);
        return [];
      }
    },
    enabled: true, // Always enabled, but with proper UUID validation
  });
};

function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}
