
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AccessCheckResult } from '@/types/subscription-types';

export const useModuleAccess = (tenantId: string | null, moduleName: string) => {
  return useQuery({
    queryKey: ['module-access', tenantId, moduleName],
    queryFn: async (): Promise<AccessCheckResult> => {
      if (!tenantId) {
        return {
          hasAccess: false,
          module: null,
          plan: null,
          subscription: null,
          subscriptionType: null
        };
      }

      // Get tenant's active subscription using type assertion
      const { data: subscription, error: subError } = await (supabase as unknown)
        .from('tenant_subscriptions')
        .select(`
          *,
          subscription_plans(*)
        `)
        .eq('tenant_id', tenantId)
        .eq('status', 'active')
        .single();

      if (subError || !subscription) {
        return {
          hasAccess: false,
          module: null,
          plan: null,
          subscription: null,
          subscriptionType: null
        };
      }

      // Check module permissions for this plan
      const { data: permission, error: permError } = await (supabase as unknown)
        .from('module_permissions')
        .select('*')
        .eq('plan_id', subscription.plan_id)
        .eq('module_name', moduleName)
        .single();

      if (permError || !permission) {
        return {
          hasAccess: false,
          module: null,
          plan: subscription.subscription_plans,
          subscription,
          subscriptionType: 'tenant'
        };
      }

      return {
        hasAccess: permission.is_enabled,
        module: {
          module_name: permission.module_name,
          is_enabled: permission.is_enabled,
          limits: permission.limits
        },
        plan: subscription.subscription_plans,
        subscription,
        subscriptionType: 'tenant'
      };
    },
    enabled: !!tenantId && !!moduleName
  });
};
