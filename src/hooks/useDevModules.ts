
import { useState, useEffect } from 'react';
import { LoadedModule, DevelopmentStageData, ModuleProgressData } from '@/types/modules';
import { moduleCodeRegistry } from '@/services/moduleCodeRegistry';
import { supabase } from '@/integrations/supabase/client';

// Helper function to safely parse development stage
const parseDevelopmentStage = (developmentStage: any): DevelopmentStageData => {
  if (!developmentStage) return { stage: 'planning', progress: 0 };
  
  if (typeof developmentStage === 'object' && developmentStage !== null && !Array.isArray(developmentStage)) {
    return {
      stage: developmentStage.stage || 'planning',
      progress: developmentStage.progress || 0,
      promoted_at: developmentStage.promoted_at,
      promoted_from: developmentStage.promoted_from
    };
  }
  
  return { stage: 'planning', progress: 0 };
};

// Helper function to parse progress data
const parseProgressData = (progressTracking: any): ModuleProgressData => {
  if (!progressTracking) {
    return {
      overall_progress: 0,
      code_completion: 0,
      test_coverage: 0,
      feature_completion: 0,
      documentation_completion: 0,
      quality_score: 0
    };
  }

  return {
    overall_progress: progressTracking.overall_progress || 0,
    code_completion: progressTracking.code_completion || 0,
    test_coverage: progressTracking.test_coverage || 0,
    feature_completion: progressTracking.feature_completion || 0,
    documentation_completion: progressTracking.documentation_completion || 0,
    quality_score: progressTracking.quality_score || 0
  };
};

export const useDevModules = () => {
  const [loadedModules, setLoadedModules] = useState<LoadedModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshModules = async () => {
    setIsLoading(true);
    try {
      console.log('🔄 Refreshing development modules...');
      
      // Get modules with progress tracking data using a JOIN
      const { data: moduleData, error } = await supabase
        .from('system_modules')
        .select(`
          *,
          module_progress_tracking (
            overall_progress,
            code_completion,
            test_coverage,
            feature_completion,
            documentation_completion,
            quality_score,
            last_updated
          )
        `)
        .eq('is_active', true);

      if (error) {
        console.error('❌ Error fetching development modules:', error);
        setLoadedModules([]);
        return;
      }

      console.log(`📋 All modules found: ${moduleData?.length || 0}`);
      
      // Filter out production modules
      const developmentModules = (moduleData || []).filter(dbModule => {
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
        
        // Parse development stage and progress data
        const developmentStage = parseDevelopmentStage(dbModule.development_stage);
        const progressData = parseProgressData(dbModule.module_progress_tracking?.[0]);
        
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
        
        console.log(`📦 Development Module ${dbModule.name}: ${status} - Stage: ${developmentStage.stage}, Progress: ${progressData.overall_progress}% ${error ? `(${error})` : ''}`);

        return {
          manifest,
          instance: hasImplementation ? { Component: hasImplementation.component } : null,
          status,
          loadedAt: new Date(),
          dependencies: [],
          error,
          developmentStage,
          progressData
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
