
import { useState, useEffect } from 'react';
import { LoadedModule } from '@/types/modules';
import { moduleCodeRegistry } from '@/services/moduleCodeRegistry';
import { supabase } from '@/integrations/supabase/client';

// Helper type for development stage
interface DevelopmentStageData {
  stage?: string;
  progress?: number;
  promoted_at?: string;
  promoted_from?: string;
}

// Helper function to safely parse development stage
const parseDevelopmentStage = (developmentStage: any): DevelopmentStageData => {
  if (!developmentStage) return {};
  
  if (typeof developmentStage === 'object' && developmentStage !== null && !Array.isArray(developmentStage)) {
    return developmentStage as DevelopmentStageData;
  }
  
  return {};
};

export const useDevModules = () => {
  const [loadedModules, setLoadedModules] = useState<LoadedModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshModules = async () => {
    setIsLoading(true);
    try {
      console.log('🔄 Refreshing development modules...');
      
      // Get modules that are not in production stage
      const { data: dbModules, error } = await supabase
        .from('system_modules')
        .select('*')
        .eq('is_active', true);

      if (error) {
        console.error('❌ Error fetching development modules:', error);
        setLoadedModules([]);
        return;
      }

      console.log(`📋 All modules found: ${dbModules?.length || 0}`);
      
      // Filter out production modules
      const developmentModules = (dbModules || []).filter(dbModule => {
        const developmentStage = parseDevelopmentStage(dbModule.development_stage);
        const stage = developmentStage.stage || 'planning';
        
        // Exclude production modules
        return stage !== 'production';
      });

      console.log(`📋 Development modules found: ${developmentModules.length}`);
      
      // Try to discover and register modules that have implementations
      const result = await moduleCodeRegistry.discoverAndRegisterModules();
      console.log(`🎯 Module discovery result: ${result.registered.length} registered, ${result.failed.length} failed`);
      
      // Create LoadedModule entries for development modules only
      const modules: LoadedModule[] = developmentModules.map(dbModule => {
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
        
        console.log(`📦 Development Module ${dbModule.name}: ${status} ${error ? `(${error})` : ''}`);

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
      console.log(`✅ Development modules processed: ${modules.length} total`);
      
    } catch (error) {
      console.error('❌ Failed to load development modules:', error);
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
