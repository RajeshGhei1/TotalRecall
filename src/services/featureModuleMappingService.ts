/**
 * Feature-Module Mapping Service
 * Provides granular feature control while maintaining module-level access as primary gate
 */

import { supabase } from '@/integrations/supabase/client';

export interface ModuleFeature {
  id: string;
  module_name: string;
  feature_id: string;
  feature_name: string;
  feature_description?: string;
  is_enabled_by_default: boolean;
  is_premium_feature: boolean;
  feature_category?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface TenantFeatureOverride {
  id: string;
  tenant_id: string;
  module_name: string;
  feature_id: string;
  is_enabled: boolean;
  override_reason?: string;
  override_type: 'admin' | 'subscription' | 'trial' | 'beta';
  expires_at?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface FeatureUsageAnalytics {
  id: string;
  tenant_id: string;
  module_name: string;
  feature_id: string;
  user_id?: string;
  usage_count: number;
  last_used_at: string;
  session_duration_minutes?: number;
  created_at: string;
}

export interface FeatureAccessResult {
  hasAccess: boolean;
  feature: ModuleFeature | null;
  override?: TenantFeatureOverride;
  accessReason: 'module_access' | 'tenant_override' | 'premium_required' | 'feature_disabled' | 'no_module_access';
}

export class FeatureModuleMappingService {
  /**
   * Get all features for a specific module
   */
  static async getModuleFeatures(moduleName: string): Promise<ModuleFeature[]> {
    const { data, error } = await supabase
      .from('module_features')
      .select('*')
      .eq('module_name', moduleName)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching module features:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get a specific feature by module and feature ID
   */
  static async getFeature(moduleName: string, featureId: string): Promise<ModuleFeature | null> {
    const { data, error } = await supabase
      .from('module_features')
      .select('*')
      .eq('module_name', moduleName)
      .eq('feature_id', featureId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      console.error('Error fetching feature:', error);
      throw error;
    }

    return data;
  }

  /**
   * Check if a tenant has access to a specific feature
   * This combines module access + feature-level controls
   */
  static async checkFeatureAccess(
    tenantId: string,
    moduleName: string,
    featureId: string,
    userId?: string
  ): Promise<FeatureAccessResult> {
    try {
      // First, get the feature definition
      const feature = await this.getFeature(moduleName, featureId);
      if (!feature) {
        return {
          hasAccess: false,
          feature: null,
          accessReason: 'feature_disabled'
        };
      }

      // Check if tenant has module access (this uses existing module access control)
      const { data: moduleAccess } = await supabase.rpc('check_module_access', {
        p_tenant_id: tenantId,
        p_module_name: moduleName,
        p_user_id: userId
      });

      if (!moduleAccess?.has_access) {
        return {
          hasAccess: false,
          feature,
          accessReason: 'no_module_access'
        };
      }

      // Check for tenant-specific overrides
      const override = await this.getTenantFeatureOverride(tenantId, moduleName, featureId);
      if (override) {
        // Check if override has expired
        if (override.expires_at && new Date(override.expires_at) < new Date()) {
          // Override expired, fall back to default behavior
        } else {
          return {
            hasAccess: override.is_enabled,
            feature,
            override,
            accessReason: 'tenant_override'
          };
        }
      }

      // Check if feature is premium and requires higher subscription
      if (feature.is_premium_feature) {
        // You can add premium subscription check here
        // For now, assume premium features are accessible if module access is granted
      }

      // Default: feature is enabled by default setting
      return {
        hasAccess: feature.is_enabled_by_default,
        feature,
        accessReason: 'module_access'
      };

    } catch (error) {
      console.error('Error checking feature access:', error);
      return {
        hasAccess: false,
        feature: null,
        accessReason: 'feature_disabled'
      };
    }
  }

  /**
   * Get tenant-specific feature override
   */
  static async getTenantFeatureOverride(
    tenantId: string,
    moduleName: string,
    featureId: string
  ): Promise<TenantFeatureOverride | null> {
    const { data, error } = await supabase
      .from('tenant_feature_overrides')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('module_name', moduleName)
      .eq('feature_id', featureId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error fetching tenant feature override:', error);
      return null;
    }

    return data;
  }

  /**
   * Create or update tenant feature override
   */
  static async setTenantFeatureOverride(
    tenantId: string,
    moduleName: string,
    featureId: string,
    isEnabled: boolean,
    overrideType: 'admin' | 'subscription' | 'trial' | 'beta' = 'admin',
    reason?: string,
    expiresAt?: Date,
    createdBy?: string
  ): Promise<TenantFeatureOverride> {
    const overrideData = {
      tenant_id: tenantId,
      module_name: moduleName,
      feature_id: featureId,
      is_enabled: isEnabled,
      override_type: overrideType,
      override_reason: reason,
      expires_at: expiresAt?.toISOString(),
      created_by: createdBy
    };

    const { data, error } = await supabase
      .from('tenant_feature_overrides')
      .upsert(overrideData, {
        onConflict: 'tenant_id,module_name,feature_id'
      })
      .select()
      .single();

    if (error) {
      console.error('Error setting tenant feature override:', error);
      throw error;
    }

    return data;
  }

  /**
   * Remove tenant feature override
   */
  static async removeTenantFeatureOverride(
    tenantId: string,
    moduleName: string,
    featureId: string
  ): Promise<void> {
    const { error } = await supabase
      .from('tenant_feature_overrides')
      .delete()
      .eq('tenant_id', tenantId)
      .eq('module_name', moduleName)
      .eq('feature_id', featureId);

    if (error) {
      console.error('Error removing tenant feature override:', error);
      throw error;
    }
  }

  /**
   * Track feature usage for analytics
   */
  static async trackFeatureUsage(
    tenantId: string,
    moduleName: string,
    featureId: string,
    userId?: string,
    sessionDurationMinutes?: number
  ): Promise<void> {
    try {
      // Check if usage record exists for today
      const today = new Date().toISOString().split('T')[0];
      const { data: existingUsage } = await supabase
        .from('feature_usage_analytics')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('module_name', moduleName)
        .eq('feature_id', featureId)
        .eq('user_id', userId)
        .gte('created_at', `${today}T00:00:00.000Z`)
        .lt('created_at', `${today}T23:59:59.999Z`)
        .single();

      if (existingUsage) {
        // Update existing record
        await supabase
          .from('feature_usage_analytics')
          .update({
            usage_count: existingUsage.usage_count + 1,
            last_used_at: new Date().toISOString(),
            session_duration_minutes: sessionDurationMinutes
          })
          .eq('id', existingUsage.id);
      } else {
        // Create new record
        await supabase
          .from('feature_usage_analytics')
          .insert({
            tenant_id: tenantId,
            module_name: moduleName,
            feature_id: featureId,
            user_id: userId,
            usage_count: 1,
            last_used_at: new Date().toISOString(),
            session_duration_minutes: sessionDurationMinutes
          });
      }
    } catch (error) {
      console.error('Error tracking feature usage:', error);
      // Don't throw error for analytics failures
    }
  }

  /**
   * Get feature usage analytics for a tenant
   */
  static async getFeatureUsageAnalytics(
    tenantId: string,
    dateFrom?: Date,
    dateTo?: Date
  ): Promise<FeatureUsageAnalytics[]> {
    let query = supabase
      .from('feature_usage_analytics')
      .select('*')
      .eq('tenant_id', tenantId);

    if (dateFrom) {
      query = query.gte('created_at', dateFrom.toISOString());
    }

    if (dateTo) {
      query = query.lte('created_at', dateTo.toISOString());
    }

    const { data, error } = await query.order('last_used_at', { ascending: false });

    if (error) {
      console.error('Error fetching feature usage analytics:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get all features across all modules
   */
  static async getAllFeatures(): Promise<ModuleFeature[]> {
    const { data, error } = await supabase
      .from('module_features')
      .select('*')
      .order('module_name', { ascending: true })
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching all features:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get features by category
   */
  static async getFeaturesByCategory(category: string): Promise<ModuleFeature[]> {
    const { data, error } = await supabase
      .from('module_features')
      .select('*')
      .eq('feature_category', category)
      .order('module_name', { ascending: true })
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching features by category:', error);
      throw error;
    }

    return data || [];
  }
}

export default FeatureModuleMappingService; 