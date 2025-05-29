
import { supabase } from '@/integrations/supabase/client';

export interface AccessAuditLog {
  id: string;
  tenant_id: string;
  user_id?: string;
  module_name: string;
  access_granted: boolean;
  access_source: 'subscription' | 'tenant_override' | 'none';
  subscription_details?: any;
  override_details?: any;
  timestamp: string;
}

export class ModuleAccessService {
  /**
   * Log module access attempts for audit purposes
   */
  static async logAccess(
    tenantId: string,
    moduleName: string,
    accessGranted: boolean,
    accessSource: 'subscription' | 'tenant_override' | 'none',
    userId?: string,
    subscriptionDetails?: any,
    overrideDetails?: any
  ): Promise<void> {
    try {
      // In a real implementation, you'd save this to a dedicated audit table
      console.log('Module Access Audit:', {
        tenant_id: tenantId,
        user_id: userId,
        module_name: moduleName,
        access_granted: accessGranted,
        access_source: accessSource,
        subscription_details: subscriptionDetails,
        override_details: overrideDetails,
        timestamp: new Date().toISOString()
      });
      
      // TODO: Implement actual audit logging to database
      // await supabase.from('module_access_audit').insert([auditData]);
    } catch (error) {
      console.error('Error logging module access:', error);
    }
  }

  /**
   * Get access statistics for a tenant
   */
  static async getAccessStats(tenantId: string) {
    try {
      // Get subscription-based modules
      const { data: tenantSub } = await (supabase as any)
        .from('tenant_subscriptions')
        .select(`
          *,
          subscription_plans(*),
          module_permissions:module_permissions!inner(*)
        `)
        .eq('tenant_id', tenantId)
        .eq('status', 'active')
        .single();

      // Get override assignments
      const { data: overrides } = await (supabase as any)
        .from('tenant_module_assignments')
        .select(`
          *,
          system_modules(*)
        `)
        .eq('tenant_id', tenantId)
        .eq('is_enabled', true);

      const subscriptionModules = tenantSub?.module_permissions?.filter((p: any) => p.is_enabled) || [];
      const overrideModules = overrides?.filter((o: any) => {
        const now = new Date();
        return !o.expires_at || new Date(o.expires_at) > now;
      }) || [];

      return {
        subscriptionModules: subscriptionModules.length,
        overrideModules: overrideModules.length,
        totalActiveModules: subscriptionModules.length + overrideModules.length,
        planName: tenantSub?.subscription_plans?.name || 'No Plan',
        overrideDetails: overrideModules.map((o: any) => ({
          moduleName: o.system_modules?.name,
          assignedAt: o.assigned_at,
          expiresAt: o.expires_at
        }))
      };
    } catch (error) {
      console.error('Error getting access stats:', error);
      return {
        subscriptionModules: 0,
        overrideModules: 0,
        totalActiveModules: 0,
        planName: 'Error',
        overrideDetails: []
      };
    }
  }

  /**
   * Get modules that need migration from override to subscription
   */
  static async getModulesNeedingMigration(tenantId: string) {
    try {
      const { data: overrides } = await (supabase as any)
        .from('tenant_module_assignments')
        .select(`
          *,
          system_modules(*)
        `)
        .eq('tenant_id', tenantId)
        .eq('is_enabled', true);

      return overrides?.map((o: any) => ({
        id: o.id,
        moduleName: o.system_modules?.name,
        moduleCategory: o.system_modules?.category,
        assignedAt: o.assigned_at,
        expiresAt: o.expires_at,
        customLimits: o.custom_limits
      })) || [];
    } catch (error) {
      console.error('Error getting modules needing migration:', error);
      return [];
    }
  }
}
