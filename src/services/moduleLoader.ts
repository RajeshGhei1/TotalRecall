
import { LoadedModule, ModuleContext, ModuleLoadOptions } from '@/types/modules';
import { moduleRegistryService } from './moduleRegistryService';

class ModuleLoader {
  private static instance: ModuleLoader;
  private loadedModules: Map<string, LoadedModule> = new Map();

  static getInstance(): ModuleLoader {
    if (!ModuleLoader.instance) {
      ModuleLoader.instance = new ModuleLoader();
    }
    return ModuleLoader.instance;
  }

  async loadModule(moduleId: string, context: ModuleContext, options?: ModuleLoadOptions): Promise<LoadedModule> {
    // Check if already loaded
    const existing = this.loadedModules.get(moduleId);
    if (existing && !options?.force) {
      return existing;
    }

    try {
      // Get module manifest from registry
      const manifest = moduleRegistryService.getModuleManifest(moduleId);
      if (!manifest) {
        throw new Error(`Module ${moduleId} not found in registry`);
      }

      // In a real implementation, this would dynamically import the module
      const moduleInstance = await this.dynamicImport(moduleId);

      const loadedModule: LoadedModule = {
        manifest,
        instance: moduleInstance,
        status: 'loaded',
        loadedAt: new Date(),
        dependencies: []
      };

      this.loadedModules.set(moduleId, loadedModule);
      return loadedModule;
    } catch (error) {
      const errorModule: LoadedModule = {
        manifest: moduleRegistryService.getModuleManifest(moduleId)!,
        instance: null,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        loadedAt: new Date(),
        dependencies: []
      };

      this.loadedModules.set(moduleId, errorModule);
      throw error;
    }
  }

  private async dynamicImport(moduleId: string): Promise<any> {
    // Mock implementation - in reality this would dynamically import modules
    try {
      switch (moduleId) {
        case 'ats-core':
          return (await import('@/modules/ats-core')).default;
        case 'talent-database':
          return (await import('@/modules/talent-database')).default;
        case 'smart-talent-analytics':
          return (await import('@/modules/smart-talent-analytics')).default;
        default:
          throw new Error(`Module ${moduleId} not found`);
      }
    } catch (error) {
      console.warn(`Failed to load module ${moduleId}, using mock component`);
      return {
        Component: () => React.createElement('div', null, `Mock component for ${moduleId}`)
      };
    }
  }

  getModule(moduleId: string): LoadedModule | undefined {
    return this.loadedModules.get(moduleId);
  }

  unloadModule(moduleId: string): boolean {
    return this.loadedModules.delete(moduleId);
  }

  getAllLoadedModules(): LoadedModule[] {
    return Array.from(this.loadedModules.values());
  }
}

export const moduleLoader = ModuleLoader.getInstance();
