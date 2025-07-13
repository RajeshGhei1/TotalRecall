
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ModuleMetadata {
  name: string;
  version: string;
  description?: string;
  author?: string;
  dependencies?: string[];
  tags?: string[];
  lastModified: string;
  fileSize: number;
  complexity?: number;
}

export interface ModuleDiscoveryResult {
  id: string;
  module_name: string;
  file_path: string;
  discovered_at: string;
  metadata?: ModuleMetadata;
  is_valid: boolean;
  error_message?: string;
}

export const useOptimizedModuleDiscovery = (tenantId: string | null) => {
  return useQuery({
    queryKey: ['optimized-module-discovery', tenantId],
    queryFn: async (): Promise<ModuleDiscoveryResult[]> => {
      if (!tenantId) return [];

      // Only check subscription-based modules now
      const { data: subscription } = await supabase
        .from('tenant_subscriptions')
        .select(`
          *,
          subscription_plans(*)
        `)
        .eq('tenant_id', tenantId)
        .eq('status', 'active')
        .single();

      if (!subscription) return [];

      // Get modules available via subscription
      const { data: permissions } = await supabase
        .from('module_permissions')
        .select('*')
        .eq('plan_id', subscription.plan_id)
        .eq('is_enabled', true);

      return (permissions || []).map(permission => ({
        moduleId: permission.module_name,
        isEnabled: true,
        source: 'subscription' as const,
        metadata: {
          limits: permission.limits,
          planName: subscription.subscription_plans?.name
        }
      }));
    },
    enabled: !!tenantId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
