
import { LoadedModule } from '@/types/modules';
import { DiscoveryResult } from './types';

export class DiscoveryEngine {
  private modules: Map<string, LoadedModule>;

  constructor(modules: Map<string, LoadedModule>) {
    this.modules = modules;
  }

  async discoverAndLoadModules(): Promise<DiscoveryResult> {
    console.log('🔍 Starting module discovery...');
    
    const loaded: string[] = [];
    const failed: { moduleId: string; error: string }[] = [];

    for (const [moduleId, module] of this.modules) {
      if (module.status === 'loaded') {
        loaded.push(moduleId);
        console.log(`✅ Module loaded: ${moduleId}`);
      } else {
        const error = 'Module not properly loaded';
        failed.push({ moduleId, error });
        console.log(`❌ Module failed: ${moduleId} - ${error}`);
      }
    }

    console.log(`🎯 Discovery complete: ${loaded.length} loaded, ${failed.length} failed`);
    return { loaded, failed };
  }

  async loadModule(moduleId: string, options?: any): Promise<LoadedModule | undefined> {
    const existingModule = this.modules.get(moduleId);
    if (existingModule && !options?.force) {
      console.warn(`⚠️ Module "${moduleId}" already loaded. Use force option to reload.`);
      return existingModule;
    }

    try {
      console.log(`🔄 Loading module: ${moduleId}`);
      
      const modulePath = this.getModulePath(moduleId);
      if (!modulePath) {
        throw new Error(`Module path not found for ${moduleId}`);
      }

      console.log(`📂 Attempting to load from: ${modulePath}`);
      const module = await import(/* @vite-ignore */ modulePath);
      const manifest = this.getModuleManifest(moduleId);

      if (!manifest) {
        throw new Error(`Manifest not found for module ${moduleId}`);
      }

      const loadedModule: LoadedModule = {
        manifest: manifest,
        instance: module,
        status: 'loaded',
        loadedAt: new Date(),
        dependencies: []
      };

      this.modules.set(moduleId, loadedModule);
      console.log(`✅ Module "${moduleId}" loaded successfully.`);
      return loadedModule;
    } catch (error) {
      console.error(`❌ Failed to load module "${moduleId}":`, error);
      return undefined;
    }
  }

  private getModulePath(moduleId: string): string | undefined {
    const module = this.modules.get(moduleId);
    return module?.manifest.entryPoint;
  }

  private getModuleManifest(moduleId: string) {
    const module = this.modules.get(moduleId);
    return module?.manifest;
  }
}
