/**
 * React hooks for feature access control
 */

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import FeatureModuleMappingService, {
  ModuleFeature,
  FeatureAccessResult,
  TenantFeatureOverride,
  FeatureUsageAnalytics
} from '@/services/featureModuleMappingService';

/**
 * Hook to check if current user has access to a specific feature
 */
export const useFeatureAccess = (moduleName: string, featureId: string) => {
  const { user } = useAuth();

  // Get current tenant ID
  const { data: tenantData } = useQuery({
    queryKey: ['currentTenantData', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_tenants')
        .select('tenant_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const currentTenantId = tenantData?.tenant_id || null;

  return useQuery({
    queryKey: ['feature-access', currentTenantId, moduleName, featureId, user?.id],
    queryFn: async (): Promise<FeatureAccessResult> => {
      if (!currentTenantId) {
        return {
          hasAccess: false,
          feature: null,
          accessReason: 'no_module_access'
        };
      }

      return FeatureModuleMappingService.checkFeatureAccess(
        currentTenantId,
        moduleName,
        featureId,
        user?.id
      );
    },
    enabled: !!currentTenantId && !!moduleName && !!featureId
  });
};

/**
 * Hook to get all features for a specific module
 */
export const useModuleFeatures = (moduleName: string) => {
  return useQuery({
    queryKey: ['module-features', moduleName],
    queryFn: () => FeatureModuleMappingService.getModuleFeatures(moduleName),
    enabled: !!moduleName
  });
};

/**
 * Hook to get a specific feature
 */
export const useFeature = (moduleName: string, featureId: string) => {
  return useQuery({
    queryKey: ['feature', moduleName, featureId],
    queryFn: () => FeatureModuleMappingService.getFeature(moduleName, featureId),
    enabled: !!moduleName && !!featureId
  });
};

/**
 * Hook to get all features across all modules
 */
export const useAllFeatures = () => {
  return useQuery({
    queryKey: ['all-features'],
    queryFn: () => FeatureModuleMappingService.getAllFeatures(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get features by category
 */
export const useFeaturesByCategory = (category: string) => {
  return useQuery({
    queryKey: ['features-by-category', category],
    queryFn: () => FeatureModuleMappingService.getFeaturesByCategory(category),
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to manage tenant feature overrides
 */
export const useTenantFeatureOverrides = () => {
  const queryClient = useQueryClient();

  const setOverride = useMutation({
    mutationFn: async ({
      tenantId,
      moduleName,
      featureId,
      isEnabled,
      overrideType = 'admin' as const,
      reason,
      expiresAt,
      createdBy
    }: {
      tenantId: string;
      moduleName: string;
      featureId: string;
      isEnabled: boolean;
      overrideType?: 'admin' | 'subscription' | 'trial' | 'beta';
      reason?: string;
      expiresAt?: Date;
      createdBy?: string;
    }) => {
      return FeatureModuleMappingService.setTenantFeatureOverride(
        tenantId,
        moduleName,
        featureId,
        isEnabled,
        overrideType,
        reason,
        expiresAt,
        createdBy
      );
    },
    onSuccess: (_, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: ['feature-access', variables.tenantId, variables.moduleName, variables.featureId]
      });
      queryClient.invalidateQueries({
        queryKey: ['tenant-feature-overrides', variables.tenantId]
      });
    }
  });

  const removeOverride = useMutation({
    mutationFn: async ({
      tenantId,
      moduleName,
      featureId
    }: {
      tenantId: string;
      moduleName: string;
      featureId: string;
    }) => {
      return FeatureModuleMappingService.removeTenantFeatureOverride(
        tenantId,
        moduleName,
        featureId
      );
    },
    onSuccess: (_, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: ['feature-access', variables.tenantId, variables.moduleName, variables.featureId]
      });
      queryClient.invalidateQueries({
        queryKey: ['tenant-feature-overrides', variables.tenantId]
      });
    }
  });

  return {
    setOverride,
    removeOverride
  };
};

/**
 * Hook to track feature usage
 */
export const useFeatureUsageTracking = () => {
  const { user } = useAuth();

  const trackUsage = useMutation({
    mutationFn: async ({
      tenantId,
      moduleName,
      featureId,
      sessionDurationMinutes
    }: {
      tenantId: string;
      moduleName: string;
      featureId: string;
      sessionDurationMinutes?: number;
    }) => {
      return FeatureModuleMappingService.trackFeatureUsage(
        tenantId,
        moduleName,
        featureId,
        user?.id,
        sessionDurationMinutes
      );
    },
    onSuccess: (_, variables) => {
      // Optionally invalidate analytics queries
      // Note: We don't invalidate to avoid performance issues
    }
  });

  return {
    trackUsage
  };
};

/**
 * Hook to get feature usage analytics
 */
export const useFeatureUsageAnalytics = (
  tenantId: string,
  dateFrom?: Date,
  dateTo?: Date
) => {
  return useQuery({
    queryKey: ['feature-usage-analytics', tenantId, dateFrom?.toISOString(), dateTo?.toISOString()],
    queryFn: () => FeatureModuleMappingService.getFeatureUsageAnalytics(tenantId, dateFrom, dateTo),
    enabled: !!tenantId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Simplified hook for quick feature access checks
 * Returns boolean and automatically tracks usage
 */
export const useFeatureEnabled = (moduleName: string, featureId: string) => {
  const { data: accessResult, isLoading } = useFeatureAccess(moduleName, featureId);
  const { trackUsage } = useFeatureUsageTracking();
  const { user } = useAuth();

  // Get current tenant ID
  const { data: tenantData } = useQuery({
    queryKey: ['currentTenantData', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_tenants')
        .select('tenant_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const currentTenantId = tenantData?.tenant_id || null;

  // Track usage when feature is accessed and enabled
  React.useEffect(() => {
    if (accessResult?.hasAccess && currentTenantId && !isLoading) {
      trackUsage.mutate({
        tenantId: currentTenantId,
        moduleName,
        featureId
      });
    }
  }, [accessResult?.hasAccess, currentTenantId, moduleName, featureId, isLoading]);

  return {
    isEnabled: accessResult?.hasAccess || false,
    isLoading,
    accessReason: accessResult?.accessReason,
    feature: accessResult?.feature
  };
};

/**
 * Component wrapper hook that provides feature access context
 */
export const useFeatureAccessContext = (moduleName: string) => {
  const { data: features } = useModuleFeatures(moduleName);
  const { user } = useAuth();

  // Get current tenant ID
  const { data: tenantData } = useQuery({
    queryKey: ['currentTenantData', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_tenants')
        .select('tenant_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const currentTenantId = tenantData?.tenant_id || null;

  // Create a function to check individual features
  const checkFeature = React.useCallback((featureId: string) => {
    if (!currentTenantId) return false;
    
    const feature = features?.find(f => f.feature_id === featureId);
    return feature?.is_enabled_by_default || false;
  }, [features, currentTenantId]);

  return {
    features: features || [],
    tenantId: currentTenantId,
    checkFeature,
    isLoading: !features && !!moduleName
  };
};

export default useFeatureAccess; 