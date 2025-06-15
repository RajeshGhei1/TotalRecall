
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
   * Log module access attempt
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
      // Use the database function to log module access
      const { data, error } = await supabase.rpc('log_module_access', {
        p_tenant_id: tenantId,
        p_user_id: userId,
        p_module_name: moduleName,
        p_access_type: accessType,
        p_access_source: accessSource,
        p_ip_address: ipAddress || null,
        p_user_agent: userAgent || null
      });

      if (error) {
        console.error('Error logging module access:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in logModuleAccess:', error);
      return null;
    }
  }

  /**
   * Check if user has developer override access
   */
  static async hasDeveloperOverride(
    userId: string,
    moduleName?: string,
    tenantId?: string
  ): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('has_developer_override', {
        p_user_id: userId,
        p_module_name: moduleName || null,
        p_tenant_id: tenantId || null
      });

      if (error) {
        console.error('Error checking developer override:', error);
        return false;
      }

      return data || false;
    } catch (error) {
      console.error('Error in hasDeveloperOverride:', error);
      return false;
    }
  }
}
