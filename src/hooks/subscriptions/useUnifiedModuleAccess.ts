
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
      const { data: userSubscription, error: userSubError } = await (supabase as any)
        .from('user_subscriptions')
        .select(`
          *,
          subscription_plans(*),
          profiles!user_subscriptions_user_id_fkey(id, email, full_name)
        `)
        .eq('user_id', userId)
        .eq('tenant_id', tenantId)
        .eq('status', 'active')
        .single();

      if (!userSubError && userSubscription) {
        const moduleAccess = await checkModulePermission(userSubscription.plan_id, moduleName);
        if (moduleAccess.hasAccess) {
          return {
            ...moduleAccess,
            subscription: userSubscription,
            subscriptionType: 'user',
            subscriptionDetails: {
              subscriptionType: 'user',
              planName: userSubscription.subscription_plans.name,
              status: userSubscription.status
            }
          };
        }
      }
    }

    // Fall back to tenant subscription
    const { data: tenantSubscription, error: tenantSubError } = await (supabase as any)
      .from('tenant_subscriptions')
      .select(`
        *,
        subscription_plans(*)
      `)
      .eq('tenant_id', tenantId)
      .eq('status', 'active')
      .single();

    if (tenantSubError || !tenantSubscription) {
      return {
        hasAccess: false,
        module: null,
        plan: null,
        subscription: null,
        subscriptionType: null
      };
    }

    const moduleAccess = await checkModulePermission(tenantSubscription.plan_id, moduleName);
    return {
      ...moduleAccess,
      subscription: tenantSubscription,
      subscriptionType: 'tenant',
      subscriptionDetails: {
        subscriptionType: 'tenant',
        planName: tenantSubscription.subscription_plans.name,
        status: tenantSubscription.status
      }
    };
  } catch (error) {
    console.error('Error checking subscription access:', error);
    return {
      hasAccess: false,
      module: null,
      plan: null,
      subscription: null,
      subscriptionType: null
    };
  }
}

async function checkTenantOverrideAccess(tenantId: string, moduleName: string): Promise<UnifiedAccessResult> {
  try {
    // Get the module first
    const { data: systemModule, error: moduleError } = await (supabase as any)
      .from('system_modules')
      .select('*')
      .eq('name', moduleName)
      .eq('is_active', true)
      .single();

    if (moduleError || !systemModule) {
      return {
        hasAccess: false,
        module: null,
        plan: null,
        subscription: null,
        subscriptionType: null
      };
    }

    // Check tenant module assignment
    const { data: assignment, error: assignmentError } = await (supabase as any)
      .from('tenant_module_assignments')
      .select(`
        *,
        profiles!tenant_module_assignments_assigned_by_fkey(full_name)
      `)
      .eq('tenant_id', tenantId)
      .eq('module_id', systemModule.id)
      .eq('is_enabled', true)
      .single();

    if (assignmentError || !assignment) {
      return {
        hasAccess: false,
        module: null,
        plan: null,
        subscription: null,
        subscriptionType: null
      };
    }

    // Check if assignment is expired
    const now = new Date();
    const isExpired = assignment.expires_at && new Date(assignment.expires_at) <= now;

    if (isExpired) {
      return {
        hasAccess: false,
        module: null,
        plan: null,
        subscription: null,
        subscriptionType: null
      };
    }

    return {
      hasAccess: true,
      module: {
        module_name: systemModule.name,
        is_enabled: true,
        limits: assignment.custom_limits || systemModule.default_limits || {}
      },
      plan: null,
      subscription: null,
      subscriptionType: null,
      overrideDetails: {
        assignedBy: assignment.profiles?.full_name || 'System',
        assignedAt: assignment.assigned_at,
        expiresAt: assignment.expires_at
      }
    };
  } catch (error) {
    console.error('Error checking tenant override access:', error);
    return {
      hasAccess: false,
      module: null,
      plan: null,
      subscription: null,
      subscriptionType: null
    };
  }
}

async function checkModulePermission(planId: string, moduleName: string) {
  const { data: permission, error: permError } = await (supabase as any)
    .from('module_permissions')
    .select('*')
    .eq('plan_id', planId)
    .eq('module_name', moduleName)
    .single();

  if (permError || !permission) {
    return {
      hasAccess: false,
      module: null
    };
  }

  return {
    hasAccess: permission.is_enabled,
    module: {
      module_name: permission.module_name,
      is_enabled: permission.is_enabled,
      limits: permission.limits
    }
  };
}
