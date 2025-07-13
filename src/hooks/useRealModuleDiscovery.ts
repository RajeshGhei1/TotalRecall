
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DiscoveryLimits {
  maxConcurrentScans: number;
  scanTimeoutMs: number;
  maxFileSize: number;
  excludedDirectories: string[];
  allowedExtensions: string[];
  maxDepth: number;
}

export interface ModuleDiscoveryConfig {
  tenant_id: string;
  enabled: boolean;
  auto_scan: boolean;
  scan_interval: number;
  limits?: DiscoveryLimits;
  webhook_url?: string;
  notification_settings: {
    on_discovery: boolean;
    on_error: boolean;
    on_completion: boolean;
  };
}

interface ModuleDiscoveryResult {
  moduleId: string;
  isEnabled: boolean;
  source: 'subscription';
  planName?: string;
  limits?: DiscoveryLimits;
}

export const useRealModuleDiscovery = (tenantId: string | null) => {
  return useQuery({
    queryKey: ['real-module-discovery', tenantId],
    queryFn: async (): Promise<ModuleDiscoveryResult[]> => {
      if (!tenantId) return [];

      try {
        // Get tenant's active subscription
        const { data: subscription } = await supabase
          .from('tenant_subscriptions')
          .select(`
            *,
            subscription_plans(*)
          `)
          .eq('tenant_id', tenantId)
          .eq('status', 'active')
          .single();

        if (!subscription) {
          console.log('No active subscription found for tenant:', tenantId);
          return [];
        }

        // Get module permissions for the subscription plan
        const { data: permissions } = await supabase
          .from('module_permissions')
          .select('*')
          .eq('plan_id', subscription.plan_id)
          .eq('is_enabled', true);

        if (!permissions || permissions.length === 0) {
          console.log('No module permissions found for plan:', subscription.plan_id);
          return [];
        }

        return permissions.map(permission => ({
          moduleId: permission.module_name,
          isEnabled: true,
          source: 'subscription' as const,
          planName: subscription.subscription_plans?.name,
          limits: permission.limits
        }));

      } catch (error) {
        console.error('Error in real module discovery:', error);
        return [];
      }
    },
    enabled: !!tenantId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });
};
