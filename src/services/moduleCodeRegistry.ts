
import { ModuleManifest, LoadedModule } from '@/types/modules';
import { supabase } from '@/integrations/supabase/client';

export interface ModuleComponent {
  id: string;
  name: string;
  component: React.ComponentType<any>;
  manifest: ModuleManifest;
  path: string;
}

export class ModuleCodeRegistry {
  private static instance: ModuleCodeRegistry;
  private registeredComponents: Map<string, ModuleComponent> = new Map();
  private componentCache: Map<string, React.ComponentType<any>> = new Map();

  static getInstance(): ModuleCodeRegistry {
    if (!ModuleCodeRegistry.instance) {
      ModuleCodeRegistry.instance = new ModuleCodeRegistry();
    }
    return ModuleCodeRegistry.instance;
  }

  /**
   * Register a React component as a module
   */
  registerComponent(
    moduleId: string,
    component: React.ComponentType<any>,
    manifest: ModuleManifest,
    path: string
  ): void {
    const moduleComponent: ModuleComponent = {
      id: moduleId,
      name: manifest.name,
      component,
      manifest,
      path
    };

    this.registeredComponents.set(moduleId, moduleComponent);
    this.componentCache.set(moduleId, component);
    
    console.log(`Registered module component: ${moduleId} (${manifest.name})`);
  }

  /**
   * Get a registered component by module ID
   */
  getComponent(moduleId: string): React.ComponentType<any> | null {
    return this.componentCache.get(moduleId) || null;
  }

  /**
   * Get module component metadata
   */
  getModuleComponent(moduleId: string): ModuleComponent | null {
    return this.registeredComponents.get(moduleId) || null;
  }

  /**
   * Get all registered modules
   */
  getAllRegisteredModules(): ModuleComponent[] {
    return Array.from(this.registeredComponents.values());
  }

  /**
   * Dynamically load a module component from the filesystem
   */
  async loadModuleComponent(moduleId: string): Promise<React.ComponentType<any> | null> {
    try {
      // Check cache first
      if (this.componentCache.has(moduleId)) {
        return this.componentCache.get(moduleId)!;
      }

      // Try to dynamically import the module
      const modulePath = `/src/modules/${moduleId}/index.tsx`;
      
      try {
        const moduleExports = await import(modulePath);
        const component = moduleExports.default || moduleExports[moduleId] || moduleExports.Component;
        
        if (component) {
          this.componentCache.set(moduleId, component);
          console.log(`Dynamically loaded module: ${moduleId}`);
          return component;
        }
      } catch (importError) {
        console.warn(`Failed to import module from ${modulePath}:`, importError);
      }

      // Fallback: try alternative paths
      const alternativePaths = [
        `/src/modules/${moduleId}/Component.tsx`,
        `/src/modules/${moduleId}/${moduleId}.tsx`,
        `/src/components/modules/${moduleId}.tsx`
      ];

      for (const altPath of alternativePaths) {
        try {
          const moduleExports = await import(altPath);
          const component = moduleExports.default || moduleExports[moduleId];
          
          if (component) {
            this.componentCache.set(moduleId, component);
            console.log(`Loaded module from alternative path: ${altPath}`);
            return component;
          }
        } catch (altError) {
          // Continue to next path
        }
      }

      console.error(`No component found for module: ${moduleId}`);
      return null;

    } catch (error) {
      console.error(`Error loading module component ${moduleId}:`, error);
      return null;
    }
  }

  /**
   * Validate that a component matches its database manifest
   */
  async validateModuleComponent(moduleId: string): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Get database manifest
      const { data: dbModule, error } = await supabase
        .from('system_modules')
        .select('*')
        .eq('name', moduleId)
        .single();

      if (error || !dbModule) {
        errors.push(`Module not found in database: ${moduleId}`);
        return { isValid: false, errors, warnings };
      }

      // Try to load component
      const component = await this.loadModuleComponent(moduleId);
      if (!component) {
        errors.push(`Component file not found for module: ${moduleId}`);
        return { isValid: false, errors, warnings };
      }

      // Check if component has required metadata
      const componentMetadata = (component as any).moduleMetadata;
      if (!componentMetadata) {
        warnings.push(`Component missing moduleMetadata: ${moduleId}`);
      }

      // Additional validation could be added here
      const isValid = errors.length === 0;
      
      return { isValid, errors, warnings };

    } catch (error) {
      errors.push(`Validation error: ${error}`);
      return { isValid: false, errors, warnings };
    }
  }

  /**
   * Discover and register all available modules
   */
  async discoverAndRegisterModules(): Promise<{
    registered: string[];
    failed: { moduleId: string; error: string }[];
  }> {
    const registered: string[] = [];
    const failed: { moduleId: string; error: string }[] = [];

    try {
      // Get all system modules from database
      const { data: modules, error } = await supabase
        .from('system_modules')
        .select('*')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching modules:', error);
        return { registered, failed };
      }

      // Try to load each module
      for (const module of modules || []) {
        try {
          const component = await this.loadModuleComponent(module.name);
          
          if (component) {
            // Create manifest from database module
            const manifest: ModuleManifest = {
              id: module.name,
              name: module.display_name || module.name,
              version: module.version || '1.0.0',
              description: module.description || '',
              category: module.category as any,
              author: 'System',
              license: 'MIT',
              dependencies: module.dependencies || [],
              entryPoint: 'index.tsx',
              requiredPermissions: module.required_permissions || [],
              subscriptionTiers: module.pricing_tier ? [module.pricing_tier] : [],
              loadOrder: 100,
              autoLoad: module.is_active,
              canUnload: true,
              minCoreVersion: '1.0.0'
            };

            this.registerComponent(
              module.name,
              component,
              manifest,
              `/src/modules/${module.name}/index.tsx`
            );

            registered.push(module.name);
          } else {
            failed.push({
              moduleId: module.name,
              error: 'Component not found'
            });
          }
        } catch (error) {
          failed.push({
            moduleId: module.name,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      console.log(`Module discovery complete: ${registered.length} registered, ${failed.length} failed`);
      return { registered, failed };

    } catch (error) {
      console.error('Error during module discovery:', error);
      return { registered, failed };
    }
  }

  /**
   * Unregister a module component
   */
  unregisterComponent(moduleId: string): boolean {
    const wasRegistered = this.registeredComponents.has(moduleId);
    this.registeredComponents.delete(moduleId);
    this.componentCache.delete(moduleId);
    
    if (wasRegistered) {
      console.log(`Unregistered module component: ${moduleId}`);
    }
    
    return wasRegistered;
  }

  /**
   * Clear all registrations (useful for testing)
   */
  clearAll(): void {
    this.registeredComponents.clear();
    this.componentCache.clear();
    console.log('Cleared all module registrations');
  }
}

export const moduleCodeRegistry = ModuleCodeRegistry.getInstance();
