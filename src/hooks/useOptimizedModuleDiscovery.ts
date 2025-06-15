
import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ModuleAccessService } from '@/services/moduleAccessService';
import { useEnhancedSystemModules } from '@/hooks/useEnhancedSystemModules';
import { useTenantModules } from '@/hooks/modules/useTenantModules';

export interface OptimizedModuleInfo {
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
}

export const useOptimizedModuleDiscovery = (tenantId?: string | null) => {
  const [discoveredModules, setDiscoveredModules] = useState<OptimizedModuleInfo[]>([]);
  
  // Get system modules with stable query
  const { data: systemModules, isLoading: systemLoading } = useEnhancedSystemModules(false);
  
  // Get tenant module assignments with stable query
  const { data: tenantModules, isLoading: tenantLoading } = useTenantModules(
    tenantId || undefined
  );

  // Static route modules - memoized to prevent re-creation
  const routeModules = useMemo(() => [
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
    }
  ], []);

  // Process modules when data changes
  useEffect(() => {
    const processModules = async () => {
      if (!systemModules) return;

      const modules: OptimizedModuleInfo[] = [];

      try {
        // Process system modules
        for (const sysModule of systemModules) {
          let accessMethod: OptimizedModuleInfo['accessMethod'] = 'core';
          let tenantAssigned = false;

          // Only check access if we have a valid tenant ID
          if (tenantId) {
            try {
              const accessResult = await ModuleAccessService.isModuleEnabled(
                tenantId,
                sysModule.name
              );
              
              if (accessResult.enabled) {
                accessMethod = accessResult.source === 'subscription' ? 'subscription' : 'override';
              } else {
                accessMethod = 'unavailable';
              }

              // Check tenant assignments
              tenantAssigned = tenantModules?.some(tm => tm.module_id === sysModule.name) || false;
            } catch (error) {
              console.warn(`Access check failed for module ${sysModule.name}:`, error);
              accessMethod = 'core';
            }
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
            }
          });
        }

        // Add route-based modules that might not be in system_modules
        for (const routeModule of routeModules) {
          if (!modules.find(m => m.id === routeModule.id)) {
            let accessMethod: OptimizedModuleInfo['accessMethod'] = 'core';
            
            if (tenantId && routeModule.subscriptionRequired) {
              try {
                const accessResult = await ModuleAccessService.isModuleEnabled(
                  tenantId,
                  routeModule.id
                );
                accessMethod = accessResult.enabled ? 
                  (accessResult.source === 'subscription' ? 'subscription' : 'override') : 
                  'unavailable';
              } catch (error) {
                console.warn(`Access check failed for route module ${routeModule.id}:`, error);
                accessMethod = 'core';
              }
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
              subscriptionRequired: routeModule.subscriptionRequired
            });
          }
        }

        setDiscoveredModules(modules);
      } catch (error) {
        console.error('Error processing modules:', error);
        setDiscoveredModules([]);
      }
    };

    if (!systemLoading && !tenantLoading) {
      processModules();
    }
  }, [systemModules, tenantModules, tenantId, systemLoading, tenantLoading, routeModules]);

  // Memoized utility functions
  const utilities = useMemo(() => ({
    getModulesByCategory: (category: string) => 
      discoveredModules.filter(module => module.category === category),
    
    getModulesByStatus: (status: OptimizedModuleInfo['status']) => 
      discoveredModules.filter(module => module.status === status),
    
    getModulesByAccess: (accessMethod: OptimizedModuleInfo['accessMethod']) => 
      discoveredModules.filter(module => module.accessMethod === accessMethod),
  }), [discoveredModules]);

  // Memoized stats
  const stats = useMemo(() => ({
    totalModules: discoveredModules.length,
    activeModules: discoveredModules.filter(m => m.status === 'active').length,
    availableModules: discoveredModules.filter(m => m.accessMethod !== 'unavailable').length
  }), [discoveredModules]);

  return {
    modules: discoveredModules,
    isLoading: systemLoading || tenantLoading,
    ...utilities,
    ...stats
  };
};
