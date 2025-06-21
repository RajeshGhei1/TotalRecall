
import { ModuleManifest, LoadedModule } from '@/types/modules';
import { BuiltInModuleConfig } from './types';
import { BUILT_IN_MODULES } from './builtInModules';

export class ModuleInitializer {
  private modules: Map<string, LoadedModule> = new Map();
  private moduleFileInfo: Map<string, { path: string; exists: boolean }> = new Map();

  async initializeBuiltInModules(): Promise<void> {
    console.log('🔧 Initializing built-in modules...');
    
    for (const moduleConfig of BUILT_IN_MODULES) {
      try {
        const manifest: ModuleManifest = {
          id: moduleConfig.id,
          name: moduleConfig.name,
          version: moduleConfig.version,
          description: moduleConfig.description,
          category: moduleConfig.category,
          author: moduleConfig.author,
          license: 'MIT',
          dependencies: moduleConfig.dependencies,
          minCoreVersion: '1.0.0',
          entryPoint: 'index.tsx',
          requiredPermissions: ['read'],
          subscriptionTiers: ['basic', 'pro', 'enterprise'],
          loadOrder: moduleConfig.loadOrder,
          autoLoad: true,
          canUnload: true
        };

        const loadedModule: LoadedModule = {
          manifest,
          instance: null,
          status: 'loaded',
          loadedAt: new Date(),
          dependencies: []
        };

        this.modules.set(moduleConfig.id, loadedModule);
        this.moduleFileInfo.set(moduleConfig.id, { 
          path: moduleConfig.path, 
          exists: true 
        });
        
        console.log(`✅ Initialized built-in module: ${moduleConfig.name}`);
      } catch (error) {
        console.error(`❌ Failed to initialize module ${moduleConfig.id}:`, error);
      }
    }
    
    console.log(`🎯 Built-in modules initialization complete: ${this.modules.size} modules`);
  }

  getModules(): Map<string, LoadedModule> {
    return this.modules;
  }

  getModuleFileInfo(): Map<string, { path: string; exists: boolean }> {
    return this.moduleFileInfo;
  }
}
