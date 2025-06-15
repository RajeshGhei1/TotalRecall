
import { ModuleManifest, LoadedModule, ModuleContext, ModuleLoadOptions } from '@/types/modules';
import { ModuleRegistry } from './moduleRegistry';

export class ModuleLoader {
  private static instance: ModuleLoader;
  private loadedModules: Map<string, LoadedModule> = new Map();
  private moduleCache: Map<string, any> = new Map();
  private dependencyGraph: Map<string, Set<string>> = new Map();

  static getInstance(): ModuleLoader {
    if (!ModuleLoader.instance) {
      ModuleLoader.instance = new ModuleLoader();
    }
    return ModuleLoader.instance;
  }

  /**
   * Load a module by ID with its dependencies
   */
  async loadModule(
    moduleId: string, 
    context: ModuleContext, 
    options: ModuleLoadOptions = {}
  ): Promise<LoadedModule> {
    console.log(`Loading module: ${moduleId}`);

    // Check if already loaded and not forced reload
    if (this.loadedModules.has(moduleId) && !options.force) {
      const existingModule = this.loadedModules.get(moduleId)!;
      if (existingModule.status === 'loaded') {
        return existingModule;
      }
    }

    try {
      // Get module manifest
      const manifest = await this.getModuleManifest(moduleId);
      if (!manifest) {
        throw new Error(`Module manifest not found: ${moduleId}`);
      }

      // Validate permissions
      this.validateModuleAccess(manifest, context);

      // Load dependencies first
      const dependencies: LoadedModule[] = [];
      if (!options.skipDependencies) {
        for (const depId of manifest.dependencies) {
          const dep = await this.loadModule(depId, context, options);
          dependencies.push(dep);
        }
      }

      // Create module entry
      const moduleEntry: LoadedModule = {
        manifest,
        instance: null,
        status: 'loading',
        loadedAt: new Date(),
        dependencies
      };

      this.loadedModules.set(moduleId, moduleEntry);

      // Load the actual module code
      const moduleInstance = await this.loadModuleCode(manifest, context, options);
      
      // Initialize module
      if (moduleInstance.initialize) {
        await moduleInstance.initialize(context);
      }

      // Update module status
      moduleEntry.instance = moduleInstance;
      moduleEntry.status = 'loaded';

      console.log(`Successfully loaded module: ${moduleId}`);
      return moduleEntry;

    } catch (error) {
      console.error(`Failed to load module ${moduleId}:`, error);
      
      const errorModule: LoadedModule = {
        manifest: await this.getModuleManifest(moduleId) || {} as ModuleManifest,
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

  /**
   * Unload a module and handle dependents
   */
  async unloadModule(moduleId: string): Promise<void> {
    const module = this.loadedModules.get(moduleId);
    if (!module || module.status !== 'loaded') {
      return;
    }

    console.log(`Unloading module: ${moduleId}`);

    try {
      // Check for dependents
      const dependents = this.getModuleDependents(moduleId);
      if (dependents.length > 0) {
        throw new Error(`Cannot unload module ${moduleId}: has dependents ${dependents.join(', ')}`);
      }

      // Call module cleanup
      if (module.instance?.cleanup) {
        await module.instance.cleanup();
      }

      // Remove from cache
      this.moduleCache.delete(moduleId);
      
      // Update status
      module.status = 'unloaded';
      module.instance = null;

      console.log(`Successfully unloaded module: ${moduleId}`);
    } catch (error) {
      console.error(`Failed to unload module ${moduleId}:`, error);
      throw error;
    }
  }

  /**
   * Get loaded module instance
   */
  getModule(moduleId: string): LoadedModule | null {
    return this.loadedModules.get(moduleId) || null;
  }

  /**
   * Get all loaded modules
   */
  getLoadedModules(): LoadedModule[] {
    return Array.from(this.loadedModules.values());
  }

  /**
   * Check if module is loaded
   */
  isModuleLoaded(moduleId: string): boolean {
    const module = this.loadedModules.get(moduleId);
    return module?.status === 'loaded';
  }

  /**
   * Reload a module (unload and load again)
   */
  async reloadModule(moduleId: string, context: ModuleContext): Promise<LoadedModule> {
    if (this.isModuleLoaded(moduleId)) {
      await this.unloadModule(moduleId);
    }
    return this.loadModule(moduleId, context, { force: true });
  }

  /**
   * Load module manifest from registry or file system
   */
  private async getModuleManifest(moduleId: string): Promise<ModuleManifest | null> {
    try {
      // First try to get from module registry (database)
      const registryModule = ModuleRegistry.getModule(moduleId);
      if (registryModule) {
        // Convert registry module to manifest format
        return this.convertRegistryToManifest(registryModule);
      }

      // Fallback to loading from module directory
      const manifestPath = `/src/modules/${moduleId}/manifest.json`;
      const response = await fetch(manifestPath);
      if (response.ok) {
        return await response.json();
      }

      return null;
    } catch (error) {
      console.error(`Error loading manifest for ${moduleId}:`, error);
      return null;
    }
  }

  /**
   * Load actual module code
   */
  private async loadModuleCode(
    manifest: ModuleManifest, 
    context: ModuleContext, 
    options: ModuleLoadOptions
  ): Promise<any> {
    const moduleId = manifest.id;

    // Check cache first
    if (this.moduleCache.has(moduleId) && !options.force) {
      return this.moduleCache.get(moduleId);
    }

    try {
      // Dynamic import of module
      const modulePath = options.developmentMode 
        ? `/src/modules/${moduleId}/${manifest.entryPoint}`
        : `/modules/${moduleId}/${manifest.entryPoint}`;

      const moduleCode = await import(modulePath);
      
      // Cache the module
      this.moduleCache.set(moduleId, moduleCode);
      
      return moduleCode;
    } catch (error) {
      console.error(`Error loading code for ${moduleId}:`, error);
      throw new Error(`Failed to load module code: ${error}`);
    }
  }

  /**
   * Validate module access permissions
   */
  private validateModuleAccess(manifest: ModuleManifest, context: ModuleContext): void {
    // Check required permissions
    for (const permission of manifest.requiredPermissions) {
      if (!context.permissions.includes(permission)) {
        throw new Error(`Missing required permission: ${permission}`);
      }
    }

    // Additional validation can be added here
  }

  /**
   * Get modules that depend on the given module
   */
  private getModuleDependents(moduleId: string): string[] {
    const dependents: string[] = [];
    
    for (const [id, module] of this.loadedModules) {
      if (module.manifest.dependencies.includes(moduleId)) {
        dependents.push(id);
      }
    }
    
    return dependents;
  }

  /**
   * Convert module registry entry to manifest format
   */
  private convertRegistryToManifest(registryModule: any): ModuleManifest {
    return {
      id: registryModule.id,
      name: registryModule.name,
      version: '1.0.0',
      description: registryModule.description,
      category: registryModule.category,
      author: 'System',
      license: 'MIT',
      dependencies: registryModule.dependencies || [],
      entryPoint: 'index.ts',
      requiredPermissions: [],
      subscriptionTiers: registryModule.pricing ? [registryModule.pricing.tier] : [],
      loadOrder: 100,
      autoLoad: true,
      canUnload: true,
      minCoreVersion: '1.0.0'
    };
  }
}

export const moduleLoader = ModuleLoader.getInstance();
