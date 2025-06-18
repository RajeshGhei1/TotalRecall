
import { useState, useEffect } from 'react';
import { LoadedModule } from '@/types/modules';
import { moduleRegistryService } from '@/services/moduleRegistryService';

export const useModuleLoader = () => {
  const [loadedModules, setLoadedModules] = useState<LoadedModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshModules = async () => {
    setIsLoading(true);
    try {
      await moduleRegistryService.initialize();
      const registryModules = moduleRegistryService.getAllModules();
      
      // Convert registry entries to loaded modules
      const modules: LoadedModule[] = registryModules.map(entry => ({
        manifest: entry.manifest,
        instance: {
          Component: null // This would be dynamically loaded in a real implementation
        },
        status: 'loaded' as const,
        loadedAt: entry.registeredAt,
        dependencies: []
      }));
      
      setLoadedModules(modules);
    } catch (error) {
      console.error('Failed to load modules:', error);
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
