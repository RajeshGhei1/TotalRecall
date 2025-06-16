
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface OptimizedModuleResult {
  moduleId: string;
  isEnabled: boolean;
  source: 'subscription';
  metadata?: any;
}

export const useOptimizedModuleDiscovery = (tenantId: string | null) => {
  return useQuery({
    queryKey: ['optimized-module-discovery', tenantId],
    queryFn: async (): Promise<OptimizedModuleResult[]> => {
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
