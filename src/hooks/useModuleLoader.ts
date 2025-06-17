
import { useState, useEffect } from 'react';
import { moduleManager } from '@/services/moduleManager';
import { LoadedModule } from '@/types/modules';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useModuleLoader = () => {
  const { user, bypassAuth } = useAuth();
  const [loadedModules, setLoadedModules] = useState<LoadedModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Get current tenant ID
  const { data: tenantData } = useQuery({
    queryKey: ['currentTenantData', user?.id],
    queryFn: async () => {
      if (bypassAuth) {
        return { tenant_id: 'mock-tenant-id' };
      }
      
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_tenants')
        .select('tenant_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user || bypassAuth,
  });

  // Initialize module system once
  useEffect(() => {
    const initializeSystem = async () => {
      if (isInitialized) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Initializing module system...');
        await moduleManager.initializeSystem();
        setIsInitialized(true);
        
        console.log('Module system initialized successfully');
      } catch (err) {
        console.error('Error initializing module system:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize module system');
      } finally {
        setIsLoading(false);
      }
    };

    initializeSystem();
  }, [isInitialized]);

  // Load tenant modules when system is initialized and tenant data is available
  useEffect(() => {
    if (!isInitialized || !tenantData?.tenant_id || !user) return;

    const initializeTenantModules = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('Initializing modules for tenant:', tenantData.tenant_id);
        
        const modules = await moduleManager.initializeTenantModules(
          tenantData.tenant_id,
          user.id
        );
        
        setLoadedModules(modules);
      } catch (err) {
        console.error('Error initializing tenant modules:', err);
        setError(err instanceof Error ? err.message : 'Failed to load modules');
      } finally {
        setIsLoading(false);
      }
    };

    initializeTenantModules();
  }, [isInitialized, tenantData?.tenant_id, user]);

  const reloadModule = async (moduleId: string) => {
    if (!tenantData?.tenant_id) return;

    try {
      const reloadedModule = await moduleManager.hotSwapModule(
        moduleId,
        '1.0.0', // Version could be dynamic
        tenantData.tenant_id
      );

      setLoadedModules(prev => 
        prev.map(module => 
          module.manifest.id === moduleId ? reloadedModule : module
        )
      );
    } catch (err) {
      console.error(`Error reloading module ${moduleId}:`, err);
      setError(err instanceof Error ? err.message : 'Failed to reload module');
    }
  };

  const getModule = (moduleId: string): LoadedModule | null => {
    return loadedModules.find(module => module.manifest.id === moduleId) || null;
  };

  const isModuleLoaded = (moduleId: string): boolean => {
    const module = getModule(moduleId);
    return module?.status === 'loaded';
  };

  const refreshModules = async () => {
    if (!isInitialized) {
      // Re-initialize the whole system
      setIsInitialized(false);
      return;
    }

    if (tenantData?.tenant_id && user) {
      const modules = await moduleManager.initializeTenantModules(
        tenantData.tenant_id,
        user.id
      );
      setLoadedModules(modules);
    }
  };

  return {
    loadedModules,
    isLoading,
    error,
    isInitialized,
    reloadModule,
    getModule,
    isModuleLoaded,
    refreshModules
  };
};
