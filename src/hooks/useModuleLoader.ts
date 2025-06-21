
import { useState, useEffect } from 'react';
import { LoadedModule } from '@/types/modules';
import { moduleCodeRegistry } from '@/services/moduleCodeRegistry';
import { supabase } from '@/integrations/supabase/client';

export const useModuleLoader = () => {
  const [loadedModules, setLoadedModules] = useState<LoadedModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshModules = async () => {
    setIsLoading(true);
    try {
      console.log('🔄 Refreshing modules...');
      
      // Clear the module cache first to remove any references to deleted modules
      moduleCodeRegistry.clearAll();
      
      // Get all system modules from database
      const { data: dbModules, error } = await supabase
        .from('system_modules')
        .select('*')
        .eq('is_active', true);

      if (error) {
        console.error('❌ Error fetching modules:', error);
        setLoadedModules([]);
        return;
      }

      console.log(`📋 Database modules found: ${dbModules?.length || 0}`);
      
      // Try to discover and register modules that have implementations
      const result = await moduleCodeRegistry.discoverAndRegisterModules();
      console.log(`🎯 Module discovery result: ${result.registered.length} registered, ${result.failed.length} failed`);
      
      // Create LoadedModule entries for all database modules
      const modules: LoadedModule[] = (dbModules || []).map(dbModule => {
        // Check if this module was successfully registered (has implementation)
        const registeredModules = moduleCodeRegistry.getAllRegisteredModules();
        const hasImplementation = registeredModules.find(rm => rm.id === dbModule.name);
        
        // Create manifest from database module
        const manifest = {
          id: dbModule.name,
          name: dbModule.name,
          version: dbModule.version || '1.0.0',
          description: dbModule.description || '',
          category: dbModule.category as any,
          author: 'System',
          license: 'MIT',
          dependencies: dbModule.dependencies || [],
          entryPoint: 'index.tsx',
          requiredPermissions: [],
          subscriptionTiers: [],
          loadOrder: 100,
          autoLoad: dbModule.is_active,
          canUnload: true,
          minCoreVersion: '1.0.0'
        };

        const status = hasImplementation ? 'loaded' as const : 'error' as const;
        const error = hasImplementation ? undefined : 'Component implementation not found';
        
        console.log(`📦 Module ${dbModule.name}: ${status} ${error ? `(${error})` : ''}`);

        return {
          manifest,
          instance: hasImplementation ? { Component: hasImplementation.component } : null,
          status,
          loadedAt: new Date(),
          dependencies: [],
          error
        };
      });
      
      setLoadedModules(modules);
      console.log(`✅ All modules processed: ${modules.length} total`);
      
    } catch (error) {
      console.error('❌ Failed to load modules:', error);
      setLoadedModules([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshModules();
  }, []);

  return {
    loadedModules,
    isLoading,
    refreshModules
  };
};
