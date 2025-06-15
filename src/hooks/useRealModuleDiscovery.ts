
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ModuleAccessService } from '@/services/moduleAccessService';
import { useEnhancedSystemModules } from '@/hooks/useEnhancedSystemModules';
import { useTenantModules } from '@/hooks/modules/useTenantModules';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface RealModuleInfo {
  id: string;
  name: string;
  category: string;
  description?: string;
  version: string;
  status: 'active' | 'inactive' | 'development';
  accessMethod: 'subscription' | 'override' | 'core' | 'unavailable';
  route?: string;
  component?: string;
  dependencies?: string[];
  tenantAssigned: boolean;
  subscriptionRequired: boolean;
  pricing?: {
    tier: string;
    monthlyPrice?: number;
    annualPrice?: number;
  };
  usage?: {
    activeUsers: number;
    requestsToday: number;
    lastAccessed?: Date;
  };
}

export const useRealModuleDiscovery = (tenantId?: string) => {
  const { user, bypassAuth } = useAuth();
  const [discoveredModules, setDiscoveredModules] = useState<RealModuleInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get system modules
  const { data: systemModules } = useEnhancedSystemModules(false);
  
  // Get tenant module assignments
  const { data: tenantModules } = useTenantModules(tenantId);

  // Get current tenant context for super admin
  const { data: tenantData } = useQuery({
    queryKey: ['superAdminTenantContext', user?.id],
    queryFn: async () => {
      if (bypassAuth) {
        return { tenant_id: 'super-admin-context' };
      }
      
      if (!user) return null;
      
      // For super admin, create a development context
      return { tenant_id: 'dev-tenant-' + user.id };
    },
    enabled: !!user || bypassAuth,
  });

  // Define known route-based modules
  const routeModules = [
    {
      id: 'ats_core',
      name: 'ATS Core',
      category: 'recruitment',
      description: 'Applicant Tracking System with jobs, candidates, and applications',
      route: '/tenant-admin/ats',
      component: 'ATS',
      subscriptionRequired: true
    },
    {
      id: 'company_data_access',
      name: 'Companies Database',
      category: 'business',
      description: 'Access to comprehensive company database',
      route: '/tenant-admin/companies',
      component: 'Companies',
      subscriptionRequired: true
    },
    {
      id: 'business_contacts_data_access',
      name: 'Business Contacts',
      category: 'business',
      description: 'Access to business contacts and people database',
      route: '/tenant-admin/contacts',
      component: 'Contacts',
      subscriptionRequired: true
    },
    {
      id: 'smart_talent_analytics',
      name: 'Smart Talent Analytics',
      category: 'analytics',
      description: 'Advanced analytics for talent acquisition',
      route: '/tenant-admin/smart-talent-analytics',
      component: 'SmartTalentAnalytics',
      subscriptionRequired: true
    },
    {
      id: 'linkedin_integration',
      name: 'LinkedIn Integration',
      category: 'integration',
      description: 'LinkedIn profile enrichment and integration',
      route: '/tenant-admin/linkedin-integration',
      component: 'LinkedInIntegrationPage',
      subscriptionRequired: true
    },
    {
      id: 'intelligent_workflows',
      name: 'Intelligent Workflows',
      category: 'core',
      description: 'Workflow automation and management',
      route: '/tenant-admin/intelligent-workflows',
      component: 'IntelligentWorkflowsPage',
      subscriptionRequired: false
    },
    {
      id: 'predictive_insights',
      name: 'Predictive Insights',
      category: 'ai',
      description: 'AI-powered predictive analytics',
      route: '/tenant-admin/predictive-insights',
      component: 'PredictiveInsights',
      subscriptionRequired: false
    }
  ];

  useEffect(() => {
    const discoverModules = async () => {
      setIsLoading(true);
      const modules: RealModuleInfo[] = [];
      const currentTenantId = tenantData?.tenant_id || tenantId;

      try {
        // Process system modules
        if (systemModules) {
          for (const sysModule of systemModules) {
            // Check access method
            let accessMethod: RealModuleInfo['accessMethod'] = 'unavailable';
            let tenantAssigned = false;

            if (currentTenantId) {
              const accessResult = await ModuleAccessService.isModuleEnabled(
                currentTenantId,
                sysModule.name
              );
              
              if (accessResult.enabled) {
                accessMethod = accessResult.source === 'subscription' ? 'subscription' : 'override';
              }

              // Check tenant assignments
              tenantAssigned = tenantModules?.some(tm => tm.module_id === sysModule.name) || false;
            }

            // Find matching route module
            const routeModule = routeModules.find(rm => 
              rm.id === sysModule.name || rm.name === sysModule.name
            );

            modules.push({
              id: sysModule.name,
              name: sysModule.name,
              category: sysModule.category,
              description: sysModule.description,
              version: sysModule.version || '1.0.0',
              status: sysModule.is_active ? 'active' : 'inactive',
              accessMethod,
              route: routeModule?.route,
              component: routeModule?.component,
              dependencies: sysModule.dependencies || [],
              tenantAssigned,
              subscriptionRequired: routeModule?.subscriptionRequired || false,
              pricing: {
                tier: sysModule.pricing_tier || 'basic',
                monthlyPrice: sysModule.monthly_price || undefined,
                annualPrice: sysModule.annual_price || undefined
              },
              usage: {
                activeUsers: Math.floor(Math.random() * 50) + 1, // Mock data
                requestsToday: Math.floor(Math.random() * 1000) + 100,
                lastAccessed: new Date(Date.now() - Math.random() * 86400000)
              }
            });
          }
        }

        // Add route-based modules that might not be in system_modules
        for (const routeModule of routeModules) {
          if (!modules.find(m => m.id === routeModule.id)) {
            let accessMethod: RealModuleInfo['accessMethod'] = 'core';
            
            if (currentTenantId && routeModule.subscriptionRequired) {
              const accessResult = await ModuleAccessService.isModuleEnabled(
                currentTenantId,
                routeModule.id
              );
              accessMethod = accessResult.enabled ? 
                (accessResult.source === 'subscription' ? 'subscription' : 'override') : 
                'unavailable';
            }

            modules.push({
              id: routeModule.id,
              name: routeModule.name,
              category: routeModule.category,
              description: routeModule.description,
              version: '1.0.0',
              status: 'active',
              accessMethod,
              route: routeModule.route,
              component: routeModule.component,
              dependencies: [],
              tenantAssigned: false,
              subscriptionRequired: routeModule.subscriptionRequired,
              usage: {
                activeUsers: Math.floor(Math.random() * 30) + 1,
                requestsToday: Math.floor(Math.random() * 500) + 50,
                lastAccessed: new Date(Date.now() - Math.random() * 86400000)
              }
            });
          }
        }

        setDiscoveredModules(modules);
      } catch (error) {
        console.error('Error discovering modules:', error);
        setDiscoveredModules([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (systemModules !== undefined) {
      discoverModules();
    }
  }, [systemModules, tenantModules, tenantData?.tenant_id, tenantId]);

  const getModulesByCategory = (category: string) => {
    return discoveredModules.filter(module => module.category === category);
  };

  const getModulesByStatus = (status: RealModuleInfo['status']) => {
    return discoveredModules.filter(module => module.status === status);
  };

  const getModulesByAccess = (accessMethod: RealModuleInfo['accessMethod']) => {
    return discoveredModules.filter(module => module.accessMethod === accessMethod);
  };

  return {
    modules: discoveredModules,
    isLoading,
    getModulesByCategory,
    getModulesByStatus,
    getModulesByAccess,
    totalModules: discoveredModules.length,
    activeModules: discoveredModules.filter(m => m.status === 'active').length,
    availableModules: discoveredModules.filter(m => m.accessMethod !== 'unavailable').length
  };
};
