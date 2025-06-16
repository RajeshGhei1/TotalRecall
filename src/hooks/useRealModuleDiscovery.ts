
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ModuleDiscoveryResult {
  moduleId: string;
  isEnabled: boolean;
  source: 'subscription';
  planName?: string;
  limits?: any;
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
