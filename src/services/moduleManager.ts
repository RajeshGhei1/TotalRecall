
import { ModuleLoader } from './moduleLoader';
import { ModuleContext, LoadedModule, ModuleManifest } from '@/types/modules';
import { ModuleAccessService } from './moduleAccessService';

export class ModuleManager {
  private static instance: ModuleManager;
  private moduleLoader: ModuleLoader;
  private moduleContexts: Map<string, ModuleContext> = new Map();

  constructor() {
    this.moduleLoader = ModuleLoader.getInstance();
  }

  static getInstance(): ModuleManager {
    if (!ModuleManager.instance) {
      ModuleManager.instance = new ModuleManager();
    }
    return ModuleManager.instance;
  }

  /**
   * Initialize modules for a tenant based on their subscriptions
   */
  async initializeTenantModules(tenantId: string, userId: string): Promise<LoadedModule[]> {
    console.log(`Initializing modules for tenant: ${tenantId}`);

    try {
      // Get tenant's available modules
      const availableModules = await this.getTenantAvailableModules(tenantId);
      
      // Create module context
      const context: ModuleContext = {
        moduleId: '', // Will be set per module
        tenantId,
        userId,
        permissions: await this.getUserPermissions(userId, tenantId),
        config: await this.getTenantModuleConfig(tenantId)
      };

      const loadedModules: LoadedModule[] = [];

      // Load modules in dependency order
      const sortedModules = this.sortModulesByDependencies(availableModules);
      
      for (const moduleId of sortedModules) {
        try {
          context.moduleId = moduleId;
          const module = await this.moduleLoader.loadModule(moduleId, context);
          loadedModules.push(module);
          
          // Store context for later use
          this.moduleContexts.set(`${tenantId}:${moduleId}`, context);
        } catch (error) {
          console.error(`Failed to load module ${moduleId} for tenant ${tenantId}:`, error);
          // Continue loading other modules even if one fails
        }
      }

      console.log(`Loaded ${loadedModules.length} modules for tenant ${tenantId}`);
      return loadedModules;

    } catch (error) {
      console.error(`Error initializing modules for tenant ${tenantId}:`, error);
      throw error;
    }
  }

  /**
   * Get modules available to a tenant based on subscriptions and overrides
   */
  async getTenantAvailableModules(tenantId: string): Promise<string[]> {
    try {
      const availableModules: string[] = [];

      // Get subscription-based modules
      const subscriptionModules = await this.getSubscriptionModules(tenantId);
      availableModules.push(...subscriptionModules);

      // Get override modules
      const overrideModules = await this.getOverrideModules(tenantId);
      availableModules.push(...overrideModules);

      // Remove duplicates
      return [...new Set(availableModules)];
    } catch (error) {
      console.error(`Error getting available modules for tenant ${tenantId}:`, error);
      return [];
    }
  }

  /**
   * Hot-swap a module to a new version
   */
  async hotSwapModule(
    moduleId: string, 
    newVersion: string, 
    tenantId: string
  ): Promise<LoadedModule> {
    console.log(`Hot-swapping module ${moduleId} to version ${newVersion}`);

    try {
      // Get current context
      const contextKey = `${tenantId}:${moduleId}`;
      const context = this.moduleContexts.get(contextKey);
      
      if (!context) {
        throw new Error(`No context found for module ${moduleId} in tenant ${tenantId}`);
      }

      // Reload the module with force flag
      const newModule = await this.moduleLoader.reloadModule(moduleId, context);
      
      console.log(`Successfully hot-swapped module ${moduleId}`);
      return newModule;

    } catch (error) {
      console.error(`Error hot-swapping module ${moduleId}:`, error);
      throw error;
    }
  }

  /**
   * Get module instance for a tenant
   */
  getModuleForTenant(moduleId: string, tenantId: string): LoadedModule | null {
    const contextKey = `${tenantId}:${moduleId}`;
    if (!this.moduleContexts.has(contextKey)) {
      return null;
    }

    return this.moduleLoader.getModule(moduleId);
  }

  /**
   * Unload all modules for a tenant
   */
  async unloadTenantModules(tenantId: string): Promise<void> {
    console.log(`Unloading modules for tenant: ${tenantId}`);

    const contextsToRemove: string[] = [];
    
    for (const [contextKey, context] of this.moduleContexts) {
      if (context.tenantId === tenantId) {
        try {
          await this.moduleLoader.unloadModule(context.moduleId);
          contextsToRemove.push(contextKey);
        } catch (error) {
          console.error(`Error unloading module ${context.moduleId}:`, error);
        }
      }
    }

    // Clean up contexts
    contextsToRemove.forEach(key => this.moduleContexts.delete(key));
  }

  /**
   * Get modules available via subscription
   */
  private async getSubscriptionModules(tenantId: string): Promise<string[]> {
    // This would integrate with the existing subscription system
    // For now, return core modules
    return ['tenant_management', 'user_management', 'subscription_management'];
  }

  /**
   * Get modules available via override
   */
  private async getOverrideModules(tenantId: string): Promise<string[]> {
    // This would integrate with the tenant_module_assignments table
    return [];
  }

  /**
   * Get user permissions for module access
   */
  private async getUserPermissions(userId: string, tenantId: string): Promise<string[]> {
    // This would integrate with the existing permission system
    return ['read', 'write', 'admin'];
  }

  /**
   * Get tenant-specific module configuration
   */
  private async getTenantModuleConfig(tenantId: string): Promise<Record<string, any>> {
    // This would load tenant-specific module configuration
    return {};
  }

  /**
   * Sort modules by their dependencies (topological sort)
   */
  private sortModulesByDependencies(moduleIds: string[]): string[] {
    // Simple implementation - in real scenario would need proper topological sort
    // For now, just return the same order
    return moduleIds;
  }
}

export const moduleManager = ModuleManager.getInstance();
