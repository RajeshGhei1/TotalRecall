
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AccessCheckResult } from '@/types/subscription-types';

export interface UnifiedAccessResult extends AccessCheckResult {
  accessSource: 'subscription' | 'tenant_override' | 'none';
  subscriptionDetails?: {
    subscriptionType: 'user' | 'tenant';
    planName: string;
    status: string;
  };
  overrideDetails?: {
    assignedBy: string;
    assignedAt: string;
    expiresAt?: string;
  };
}

export const useUnifiedModuleAccess = (tenantId: string | null, moduleName: string, userId?: string) => {
  return useQuery({
    queryKey: ['unified-module-access', tenantId, moduleName, userId],
    queryFn: async (): Promise<UnifiedAccessResult> => {
      if (!tenantId) {
        return {
          hasAccess: false,
          module: null,
          plan: null,
          subscription: null,
          subscriptionType: null,
          accessSource: 'none'
        };
      }

      // Step 1: Check subscription-based access (priority)
      const subscriptionAccess = await checkSubscriptionAccess(tenantId, moduleName, userId);
      
      if (subscriptionAccess.hasAccess) {
        return {
          ...subscriptionAccess,
          accessSource: 'subscription'
        };
      }

      // Step 2: Check direct tenant assignment (override/fallback)
      const tenantOverrideAccess = await checkTenantOverrideAccess(tenantId, moduleName);
      
      if (tenantOverrideAccess.hasAccess) {
        return {
          ...tenantOverrideAccess,
          accessSource: 'tenant_override'
        };
      }

      // No access found
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
            plan: userSubscription.subscription_plans,
            subscription: userSubscription,
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
          plan: tenantSubscription.subscription_plans,
          subscription: tenantSubscription,
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

async function checkTenantOverrideAccess(tenantId: string, moduleName: string): Promise<UnifiedAccessResult> {
  try {
    // Get module ID first
    const { data: module } = await supabase
      .from('system_modules')
      .select('id, name')
      .eq('name', moduleName)
      .single();

    if (!module) {
      return {
        hasAccess: false,
        module: null,
        plan: null,
        subscription: null,
        subscriptionType: null,
        accessSource: 'none'
      };
    }

    // Check tenant module assignment
    const { data: assignment, error } = await supabase
      .from('tenant_module_assignments')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('module_id', module.id)
      .eq('is_enabled', true)
      .single();

    if (error || !assignment) {
      return {
        hasAccess: false,
        module: null,
        plan: null,
        subscription: null,
        subscriptionType: null,
        accessSource: 'none'
      };
    }

    // Check if assignment is expired
    if (assignment.expires_at && new Date(assignment.expires_at) <= new Date()) {
      return {
        hasAccess: false,
        module: null,
        plan: null,
        subscription: null,
        subscriptionType: null,
        accessSource: 'none'
      };
    }

    return {
      hasAccess: true,
      module: {
        module_name: moduleName,
        is_enabled: true,
        limits: assignment.custom_limits as Record<string, any> || {}
      },
      plan: null,
      subscription: null,
      subscriptionType: null,
      accessSource: 'tenant_override',
      overrideDetails: {
        assignedBy: assignment.assigned_by,
        assignedAt: assignment.assigned_at,
        expiresAt: assignment.expires_at || undefined
      }
    };
  } catch (error) {
    console.error('Error checking tenant override access:', error);
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
