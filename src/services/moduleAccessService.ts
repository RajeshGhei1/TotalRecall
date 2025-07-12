
import { supabase } from '@/integrations/supabase/client';
import { SubscriptionService } from './subscriptionService';

export interface ModuleAccessStats {
  subscriptionModules: number;
  totalActiveModules: number;
  planName: string;
}

export class ModuleAccessService {
  /**
   * Get comprehensive access statistics for a tenant
   */
  static async getAccessStats(tenantId: string): Promise<ModuleAccessStats> {
    try {
      // Get tenant subscription overview
      const overview = await SubscriptionService.getTenantSubscriptionOverview(tenantId);
      
      // Get modules available via subscription
      let subscriptionModules = 0;
      let planName = 'No Plan';
      
      if (overview?.tenantSubscription) {
        const { data: permissions } = await supabase
          .from('module_permissions')
          .select('*')
          .eq('plan_id', overview.tenantSubscription.plan_id)
          .eq('is_enabled', true);
        
        subscriptionModules = permissions?.length || 0;
        planName = overview.tenantSubscription.subscription_plans?.name || 'Unknown Plan';
      }

      return {
        subscriptionModules,
        totalActiveModules: subscriptionModules,
        planName
      };
    } catch (error) {
      console.error('Error getting access stats:', error);
      return {
        subscriptionModules: 0,
        totalActiveModules: 0,
        planName: 'Error'
      };
    }
  }

  /**
   * Check if a module is enabled for a tenant via subscription only
   */
  static async isModuleEnabled(tenantId: string, moduleName: string): Promise<{
    enabled: boolean;
    source: 'subscription' | 'none';
  }> {
    try {
      // Check subscription-based access only
      const overview = await SubscriptionService.getTenantSubscriptionOverview(tenantId);
      
      if (overview?.tenantSubscription) {
        const { data: permission } = await supabase
          .from('module_permissions')
          .select('*')
          .eq('plan_id', overview.tenantSubscription.plan_id)
          .eq('module_name', moduleName)
          .eq('is_enabled', true)
          .single();

        if (permission) {
          return { enabled: true, source: 'subscription' };
        }
      }

      return { enabled: false, source: 'none' };
    } catch (error) {
      console.error('Error checking module enablement:', error);
      return { enabled: false, source: 'none' };
    }
  }

  /**
   * Log module access attempt (subscription-only)
   */
  static async logModuleAccess(
    tenantId: string,
    userId: string,
    moduleName: string,
    accessType: 'allowed' | 'denied',
    accessSource: 'subscription',
    ipAddress?: string,
    userAgent?: string
  ): Promise<string | null> {
    try {
      const { data, error } = await (supabase as unknown)
        .from('module_access_logs')
        .insert({
          tenant_id: tenantId,
          user_id: userId,
          module_id: moduleName,
          access_type: accessType,
          access_source: accessSource,
          ip_address: ipAddress || null,
          user_agent: userAgent || null
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error logging module access:', error);
        return null;
      }

      return data?.id || null;
    } catch (error) {
      console.error('Error in logModuleAccess:', error);
      return null;
    }
  }
}
