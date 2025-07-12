
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AccessCheckResult } from '@/types/subscription-types';

export interface UnifiedAccessResult extends AccessCheckResult {
  accessSource: 'subscription' | 'none';
  subscriptionDetails?: {
    subscriptionType: 'user' | 'tenant';
    planName: string;
    status: string;
  };
}

export const useUnifiedModuleAccess = (tenantId: string | null, moduleName: string, userId?: string) => {
  return useQuery({
    queryKey: ['unified-module-access', tenantId, moduleName, userId],
    queryFn: async (): Promise<UnifiedAccessResult> => {
      console.log(`Checking access for module: ${moduleName}, tenant: ${tenantId}, user: ${userId}`);

      if (!tenantId) {
        console.log('No tenant ID provided, denying access');
        return {
          hasAccess: false,
          module: null,
          plan: null,
          subscription: null,
          subscriptionType: null,
          accessSource: 'none'
        };
      }

      // Check subscription-based access only
      const subscriptionAccess = await checkSubscriptionAccess(tenantId, moduleName, userId);
      
      if (subscriptionAccess.hasAccess) {
        console.log(`Access granted for ${moduleName} via subscription`);
        return {
          ...subscriptionAccess,
          accessSource: 'subscription'
        };
      }

      console.log(`Access denied for ${moduleName} - no subscription access`);
      return {
        hasAccess: false,
        module: null,
        plan: null,
        subscription: null,
        subscriptionType: null,
        accessSource: 'none'
      };
    },
    enabled: !!tenantId && !!moduleName
  });
};

async function checkSubscriptionAccess(tenantId: string, moduleName: string, userId?: string): Promise<UnifiedAccessResult> {
  try {
    // Get user's active subscription first (if userId provided)
    if (userId) {
      const { data: userSubscription, error: userSubError } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          subscription_plans(*)
        `)
        .eq('user_id', userId)
        .eq('tenant_id', tenantId)
        .eq('status', 'active')
        .single();

      if (!userSubError && userSubscription) {
        // Check if this plan includes the module
        const { data: permission } = await supabase
          .from('module_permissions')
          .select('*')
          .eq('plan_id', userSubscription.plan_id)
          .eq('module_name', moduleName)
          .eq('is_enabled', true)
          .single();

        if (permission) {
          return {
            hasAccess: true,
            module: {
              module_name: moduleName,
              is_enabled: true,
              limits: permission.limits as Record<string, any>
            },
            plan: userSubscription.subscription_plans as unknown,
            subscription: userSubscription as unknown,
            subscriptionType: 'user',
            accessSource: 'subscription',
            subscriptionDetails: {
              subscriptionType: 'user',
              planName: userSubscription.subscription_plans?.name || 'Unknown',
              status: userSubscription.status
            }
          };
        }
      }
    }

    // Check tenant subscription
    const { data: tenantSubscription, error: tenantSubError } = await supabase
      .from('tenant_subscriptions')
      .select(`
        *,
        subscription_plans(*)
      `)
      .eq('tenant_id', tenantId)
      .eq('status', 'active')
      .single();

    if (!tenantSubError && tenantSubscription) {
      // Check if this plan includes the module
      const { data: permission } = await supabase
        .from('module_permissions')
        .select('*')
        .eq('plan_id', tenantSubscription.plan_id)
        .eq('module_name', moduleName)
        .eq('is_enabled', true)
        .single();

      if (permission) {
        return {
          hasAccess: true,
          module: {
            module_name: moduleName,
            is_enabled: true,
            limits: permission.limits as Record<string, any>
          },
          plan: tenantSubscription.subscription_plans as unknown,
          subscription: tenantSubscription as unknown,
          subscriptionType: 'tenant',
          accessSource: 'subscription',
          subscriptionDetails: {
            subscriptionType: 'tenant',
            planName: tenantSubscription.subscription_plans?.name || 'Unknown',
            status: tenantSubscription.status
          }
        };
      }
    }

    return {
      hasAccess: false,
      module: null,
      plan: null,
      subscription: null,
      subscriptionType: null,
      accessSource: 'none'
    };
  } catch (error) {
    console.error('Error checking subscription access:', error);
    return {
      hasAccess: false,
      module: null,
      plan: null,
      subscription: null,
      subscriptionType: null,
      accessSource: 'none'
    };
  }
}
