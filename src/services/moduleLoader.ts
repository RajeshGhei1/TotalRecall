import React from 'react';
import { ModuleManifest, LoadedModule, ModuleContext, ModuleLoadOptions } from '@/types/modules';
import { supabase } from '@/integrations/supabase/client';
import { moduleCodeRegistry } from './moduleCodeRegistry';

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
      // Get module manifest from database
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

      // Load the actual module code using the new registry
      const moduleInstance = await this.loadModuleCode(manifest, context, options);
      
      // Initialize module if it has an initialize method
      if (moduleInstance && typeof moduleInstance.initialize === 'function') {
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
   * Load actual module code using the component registry
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
      // Try to get component from registry first
      let component = moduleCodeRegistry.getComponent(moduleId);
      
      // If not in registry, try to load it dynamically
      if (!component) {
        console.log(`Component not in registry, attempting dynamic load: ${moduleId}`);
        component = await moduleCodeRegistry.loadModuleComponent(moduleId);
      }

      if (!component) {
        throw new Error(`Component not found for module: ${moduleId}`);
      }

      // Create module wrapper with context
      const moduleWrapper = {
        Component: component,
        manifest,
        context,
        initialize: async (ctx: ModuleContext) => {
          console.log(`Initializing module ${moduleId} with context:`, ctx);
        },
        cleanup: async () => {
          console.log(`Cleaning up module ${moduleId}`);
        },
        getMetadata: () => (component as any).moduleMetadata || {},
        render: (props: any = {}) => {
          const mergedProps = { ...props, ...context.config };
          return React.createElement(component, mergedProps);
        }
      };
      
      // Cache the wrapped module
      this.moduleCache.set(moduleId, moduleWrapper);
      
      return moduleWrapper;
    } catch (error) {
      console.error(`Error loading code for ${moduleId}:`, error);
      throw new Error(`Failed to load module code: ${error}`);
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

      // Remove from cache and registry
      this.moduleCache.delete(moduleId);
      moduleCodeRegistry.unregisterComponent(moduleId);
      
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
   * Load module manifest from database
   */
  private async getModuleManifest(moduleId: string): Promise<ModuleManifest | null> {
    try {
      // Get module from database
      const { data: module, error } = await supabase
        .from('system_modules')
        .select('*')
        .eq('name', moduleId)
        .single();

      if (error || !module) {
        console.error(`Module not found in database: ${moduleId}`);
        return null;
      }

      // Convert database module to manifest format
      return this.convertDatabaseToManifest(module);
    } catch (error) {
      console.error(`Error loading manifest for ${moduleId}:`, error);
      return null;
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
   * Convert database module entry to manifest format
   */
  private convertDatabaseToManifest(dbModule: any): ModuleManifest {
    return {
      id: dbModule.name,
      name: dbModule.display_name || dbModule.name,
      version: dbModule.version || '1.0.0',
      description: dbModule.description || '',
      category: dbModule.category,
      author: 'System',
      license: 'MIT',
      dependencies: dbModule.dependencies || [],
      entryPoint: 'index.tsx',
      requiredPermissions: dbModule.required_permissions || [],
      subscriptionTiers: dbModule.pricing_tier ? [dbModule.pricing_tier] : [],
      loadOrder: 100,
      autoLoad: dbModule.is_active,
      canUnload: true,
      minCoreVersion: '1.0.0'
    };
  }

  /**
   * Initialize the module loader with component discovery
   */
  async initialize(): Promise<void> {
    console.log('Initializing ModuleLoader with enhanced component discovery...');
    
    try {
      // Use the new discovery service
      const { moduleDiscoveryService } = await import('./moduleDiscoveryService');
      const result = await moduleDiscoveryService.discoverAndLoadModules();
      
      console.log(`Enhanced module discovery completed: ${result.loaded.length} loaded, ${result.failed.length} failed`);
      
      if (result.failed.length > 0) {
        console.warn('Some modules failed to load:', result.failed);
      }

      // Also try database discovery as fallback
      try {
        const dbResult = await moduleCodeRegistry.discoverAndRegisterModules();
        console.log(`Database module discovery: ${dbResult.registered.length} registered, ${dbResult.failed.length} failed`);
      } catch (dbError) {
        console.warn('Database module discovery failed:', dbError);
      }
    } catch (error) {
      console.error('Error during module loader initialization:', error);
    }
  }
}

export const moduleLoader = ModuleLoader.getInstance();
