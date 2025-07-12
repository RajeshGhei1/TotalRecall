
import { ModuleManifest, LoadedModule } from '@/types/modules';
import { 
  ModuleLoader, 
  ModuleValidator, 
  ComponentRegistry, 
  ModuleDiscovery,
  ModuleComponent,
  ValidationResult,
  DiscoveryResult
} from './moduleCodeRegistry/index';

export type { ModuleComponent, ValidationResult, DiscoveryResult };

export class ModuleCodeRegistry {
  private static instance: ModuleCodeRegistry;
  private moduleLoader: ModuleLoader;
  private moduleValidator: ModuleValidator;
  private componentRegistry: ComponentRegistry;
  private moduleDiscovery: ModuleDiscovery;

  private constructor() {
    this.moduleLoader = new ModuleLoader();
    this.moduleValidator = new ModuleValidator(this.moduleLoader);
    this.componentRegistry = new ComponentRegistry();
    this.moduleDiscovery = new ModuleDiscovery(this.moduleLoader, this.componentRegistry);
  }

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
    component: React.ComponentTypeunknown,
    manifest: ModuleManifest,
    path: string
  ): void {
    this.componentRegistry.registerComponent(moduleId, component, manifest, path);
    this.moduleLoader.cacheComponent(moduleId, component);
  }

  /**
   * Get a registered component by module ID
   */
  getComponent(moduleId: string): React.ComponentTypeunknown | null {
    return this.moduleLoader.getCachedComponent(moduleId);
  }

  /**
   * Get module component metadata
   */
  getModuleComponent(moduleId: string): ModuleComponent | null {
    return this.componentRegistry.getModuleComponent(moduleId);
  }

  /**
   * Get all registered modules
   */
  getAllRegisteredModules(): ModuleComponent[] {
    return this.componentRegistry.getAllRegisteredModules();
  }

  /**
   * Dynamically load a module component using proper Vite import paths
   */
  async loadModuleComponent(moduleId: string): Promise<React.ComponentTypeunknown | null> {
    return this.moduleLoader.loadModuleComponent(moduleId);
  }

  /**
   * Validate that a component matches its database manifest
   */
  async validateModuleComponent(moduleId: string): Promise<ValidationResult> {
    return this.moduleValidator.validateModuleComponent(moduleId);
  }

  /**
   * Discover and register all available modules
   */
  async discoverAndRegisterModules(): Promise<DiscoveryResult> {
    return this.moduleDiscovery.discoverAndRegisterModules();
  }

  /**
   * Unregister a module component
   */
  unregisterComponent(moduleId: string): boolean {
    this.moduleLoader.removeCachedComponent(moduleId);
    return this.componentRegistry.unregisterComponent(moduleId);
  }

  /**
   * Clear all registrations (useful for testing)
   */
  clearAll(): void {
    this.componentRegistry.clearAll();
    this.moduleLoader.clearCache();
  }
}

export const moduleCodeRegistry = ModuleCodeRegistry.getInstance();
