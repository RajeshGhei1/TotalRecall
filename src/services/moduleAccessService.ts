
import { supabase } from '@/integrations/supabase/client';
import { SubscriptionService } from './subscriptionService';

export interface ModuleAccessStats {
  subscriptionModules: number;
  overrideModules: number;
  totalActiveModules: number;
  planName: string;
}

export interface ModuleMigrationCandidate {
  id: string;
  moduleName: string;
  moduleCategory: string;
  assignedAt: string;
  expiresAt?: string;
  assignedBy: string;
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

      // Get modules available via override
      const { data: overrides } = await supabase
        .from('tenant_module_assignments')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('is_enabled', true);

      const overrideModules = overrides?.length || 0;

      return {
        subscriptionModules,
        overrideModules,
        totalActiveModules: subscriptionModules + overrideModules,
        planName
      };
    } catch (error) {
      console.error('Error getting access stats:', error);
      return {
        subscriptionModules: 0,
        overrideModules: 0,
        totalActiveModules: 0,
        planName: 'Error'
      };
    }
  }

  /**
   * Get modules that need migration from override to subscription
   */
  static async getModulesNeedingMigration(tenantId: string): Promise<ModuleMigrationCandidate[]> {
    try {
      const { data: assignments } = await supabase
        .from('tenant_module_assignments')
        .select(`
          *,
          module:system_modules(name, category)
        `)
        .eq('tenant_id', tenantId)
        .eq('is_enabled', true);

      if (!assignments) return [];

      return assignments.map(assignment => ({
        id: assignment.id,
        moduleName: assignment.module?.name || 'Unknown Module',
        moduleCategory: assignment.module?.category || 'Unknown',
        assignedAt: assignment.assigned_at,
        expiresAt: assignment.expires_at || undefined,
        assignedBy: assignment.assigned_by
      }));
    } catch (error) {
      console.error('Error getting migration candidates:', error);
      return [];
    }
  }

  /**
   * Check if a module is enabled for a tenant (via any method)
   */
  static async isModuleEnabled(tenantId: string, moduleName: string): Promise<{
    enabled: boolean;
    source: 'subscription' | 'override' | 'none';
  }> {
    try {
      // First check subscription-based access
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

      // Check override access - using module name directly since system_modules uses name as PK
      const { data: assignment } = await supabase
        .from('tenant_module_assignments')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('module_id', moduleName) // Changed to use module name directly
        .eq('is_enabled', true)
        .single();

      if (assignment) {
        return { enabled: true, source: 'override' };
      }

      return { enabled: false, source: 'none' };
    } catch (error) {
      console.error('Error checking module enablement:', error);
      return { enabled: false, source: 'none' };
    }
  }

  /**
   * Log module access attempt - using type assertion for new table
   */
  static async logModuleAccess(
    tenantId: string,
    userId: string,
    moduleName: string,
    accessType: 'allowed' | 'denied' | 'upgraded',
    accessSource: 'subscription' | 'override' | 'developer_mode',
    ipAddress?: string,
    userAgent?: string
  ): Promise<string | null> {
    try {
      // Use type assertion for the new table until types are regenerated
      const { data, error } = await (supabase as any)
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

  /**
   * Check if user has developer override access - using type assertion for new table
   */
  static async hasDeveloperOverride(
    userId: string,
    moduleName?: string,
    tenantId?: string
  ): Promise<boolean> {
    try {
      // Use type assertion for the new table until types are regenerated
      const { data, error } = await (supabase as any)
        .from('developer_overrides')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        return false;
      }

      // Simple check - if user has any active override, return true
      // This can be enhanced later with more complex logic
      return true;
    } catch (error) {
      console.error('Error in hasDeveloperOverride:', error);
      return false;
    }
  }
}
