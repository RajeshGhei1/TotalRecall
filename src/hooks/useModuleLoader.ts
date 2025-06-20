
import { useState, useEffect } from 'react';
import { LoadedModule } from '@/types/modules';
import { moduleCodeRegistry } from '@/services/moduleCodeRegistry';

export const useModuleLoader = () => {
  const [loadedModules, setLoadedModules] = useState<LoadedModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshModules = async () => {
    setIsLoading(true);
    try {
      console.log('Refreshing modules...');
      
      // Discover and register all available modules
      const result = await moduleCodeRegistry.discoverAndRegisterModules();
      console.log('Module discovery result:', result);
      
      // Get all registered modules
      const registeredModules = moduleCodeRegistry.getAllRegisteredModules();
      console.log('Registered modules:', registeredModules);
      
      // Convert to LoadedModule format
      const modules: LoadedModule[] = registeredModules.map(moduleComponent => ({
        manifest: moduleComponent.manifest,
        instance: {
          Component: moduleComponent.component
        },
        status: 'loaded' as const,
        loadedAt: new Date(),
        dependencies: moduleComponent.manifest.dependencies || []
      }));
      
      setLoadedModules(modules);
      console.log('Loaded modules:', modules);
    } catch (error) {
      console.error('Failed to load modules:', error);
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
