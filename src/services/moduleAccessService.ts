
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

      // Check override access
      const { data: assignment } = await supabase
        .from('tenant_module_assignments')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('module_id', (await this.getModuleIdByName(moduleName)) || '')
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
   * Helper to get module ID by name
   */
  private static async getModuleIdByName(moduleName: string): Promise<string | null> {
    try {
      const { data: module } = await supabase
        .from('system_modules')
        .select('id')
        .eq('name', moduleName)
        .single();

      return module?.id || null;
    } catch (error) {
      return null;
    }
  }
}
