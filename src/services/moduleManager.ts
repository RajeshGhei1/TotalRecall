import { ModuleLoader } from './moduleLoader';
import { ModuleContext, LoadedModule, ModuleManifest } from '@/types/modules';
import { ModuleAccessService } from './moduleAccessService';
import { moduleRepository } from './moduleRepository';
import { moduleVersionManager } from './moduleVersionManager';
import { moduleCodeRegistry } from './moduleCodeRegistry';
import { supabase } from '@/integrations/supabase/client';

export class ModuleManager {
  private static instance: ModuleManager;
  private moduleLoader: ModuleLoader;
  private moduleContexts: Map<string, ModuleContext> = new Map();
  private deploymentCallbacks: Map<string, Function[]> = new Map();

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
   * Initialize the module system
   */
  async initializeSystem(): Promise<void> {
    console.log('Initializing ModuleManager system with enhanced discovery...');
    
    try {
      // Initialize the discovery service
      const { moduleDiscoveryService } = await import('./moduleDiscoveryService');
      moduleDiscoveryService.initializeKnownModules();
      
      // Initialize the module loader (which will discover components)
      await this.moduleLoader.initialize();
      
      console.log('ModuleManager system initialized successfully with enhanced discovery');
    } catch (error) {
      console.error('Error initializing ModuleManager system:', error);
      throw error;
    }
  }

  /**
   * Initialize modules for a tenant based on their subscriptions only
   */
  async initializeTenantModules(tenantId: string, userId: string): Promise<LoadedModule[]> {
    console.log(`Initializing modules for tenant: ${tenantId}`);

    try {
      // Get tenant's available modules (subscription-only now)
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
          
          // Trigger post-load callbacks
          await this.triggerPostLoadCallbacks(moduleId, module);
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
   * Hot-swap a module to a new version with enhanced deployment support
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

      // Trigger pre-swap callbacks
      await this.triggerPreSwapCallbacks(moduleId, newVersion);

      // Clear component cache to force reload
      moduleCodeRegistry.unregisterComponent(moduleId);

      // Perform the hot-swap
      const newModule = await this.moduleLoader.reloadModule(moduleId, context);
      
      // Update module context with new version
      context.moduleId = `${moduleId}@${newVersion}`;
      this.moduleContexts.set(contextKey, context);

      // Trigger post-swap callbacks
      await this.triggerPostSwapCallbacks(moduleId, newModule);
      
      console.log(`Successfully hot-swapped module ${moduleId} to version ${newVersion}`);
      return newModule;

    } catch (error) {
      console.error(`Error hot-swapping module ${moduleId}:`, error);
      throw error;
    }
  }

  /**
   * Deploy a module across all applicable tenants
   */
  async deployModuleGlobally(moduleId: string, version: string): Promise<{
    success: string[];
    failed: { tenantId: string; error: string }[];
  }> {
    console.log(`Deploying module ${moduleId}@${version} globally`);

    const success: string[] = [];
    const failed: { tenantId: string; error: string }[] = [];

    try {
      // Get all tenants that have access to this module
      const tenantIds = await this.getTenantsWithModuleAccess(moduleId);

      // Deploy to each tenant
      for (const tenantId of tenantIds) {
        try {
          await this.hotSwapModule(moduleId, version, tenantId);
          success.push(tenantId);
        } catch (error) {
          failed.push({
            tenantId,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      console.log(`Global deployment completed: ${success.length} success, ${failed.length} failed`);
      return { success, failed };

    } catch (error) {
      console.error(`Error during global deployment of ${moduleId}:`, error);
      throw error;
    }
  }

  /**
   * Register deployment callbacks
   */
  registerDeploymentCallback(moduleId: string, callback: Function): void {
    if (!this.deploymentCallbacks.has(moduleId)) {
      this.deploymentCallbacks.set(moduleId, []);
    }
    this.deploymentCallbacks.get(moduleId)!.push(callback);
  }

  /**
   * Get deployment status for all modules
   */
  async getDeploymentStatus(): Promise<{
    moduleId: string;
    currentVersion: string;
    availableVersions: string[];
    deploymentHealth: 'healthy' | 'warning' | 'error';
    isRegistered: boolean;
  }[]> {
    const status: unknown[] = [];

    try {
      // Get registered modules from code registry
      const registeredModules = moduleCodeRegistry.getAllRegisteredModules();
      const registeredIds = new Set(registeredModules.map(m => m.id));

      // Get database modules
      const { data: dbModules } = await supabase
        .from('system_modules')
        .select('*')
        .eq('is_active', true);

      const moduleMap = new Map();
      dbModules?.forEach(module => {
        const id = module.name;
        if (!moduleMap.has(id)) {
          moduleMap.set(id, []);
        }
        moduleMap.get(id).push(module);
      });

      for (const [moduleId, modules] of moduleMap) {
        const currentVersion = modules[0]?.version || '1.0.0';
        const availableVersions = modules.map((m: unknown) => m.version);
        const isRegistered = registeredIds.has(moduleId);
        
        // Determine health status
        let deploymentHealth: 'healthy' | 'warning' | 'error' = 'healthy';
        if (!isRegistered) {
          deploymentHealth = 'error';
        } else if (modules.some((m: unknown) => !m.is_active)) {
          deploymentHealth = 'warning';
        }

        status.push({
          moduleId,
          currentVersion,
          availableVersions,
          deploymentHealth,
          isRegistered
        });
      }

      return status;
    } catch (error) {
      console.error('Error getting deployment status:', error);
      return [];
    }
  }

  /**
   * Get modules available to a tenant based on subscriptions only (no overrides)
   */
  async getTenantAvailableModules(tenantId: string): Promise<string[]> {
    try {
      const availableModules: string[] = [];

      // Get subscription-based modules only
      const subscriptionModules = await this.getSubscriptionModules(tenantId);
      availableModules.push(...subscriptionModules);

      // Get core modules from database
      const { data: coreModules } = await supabase
        .from('system_modules')
        .select('name')
        .eq('category', 'core')
        .eq('is_active', true);

      if (coreModules) {
        availableModules.push(...coreModules.map(m => m.name));
      }

      // Remove duplicates and filter by registered components
      const uniqueModules = [...new Set(availableModules)];
      const registeredModules = moduleCodeRegistry.getAllRegisteredModules();
      const registeredIds = new Set(registeredModules.map(m => m.id));
      
      return uniqueModules.filter(moduleId => registeredIds.has(moduleId));
    } catch (error) {
      console.error(`Error getting available modules for tenant ${tenantId}:`, error);
      return [];
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
   * Get tenants that have access to a specific module
   */
  private async getTenantsWithModuleAccess(moduleId: string): Promise<string[]> {
    // This would query the database for tenants with access to the module
    // For now, return a mock list
    return ['tenant-1', 'tenant-2'];
  }

  /**
   * Trigger pre-deployment callbacks
   */
  private async triggerPreSwapCallbacks(moduleId: string, newVersion: string): Promise<void> {
    const callbacks = this.deploymentCallbacks.get(moduleId) || [];
    for (const callback of callbacks) {
      try {
        await callback('pre-swap', { moduleId, newVersion });
      } catch (error) {
        console.error(`Pre-swap callback failed for ${moduleId}:`, error);
      }
    }
  }

  /**
   * Trigger post-deployment callbacks
   */
  private async triggerPostSwapCallbacks(moduleId: string, module: LoadedModule): Promise<void> {
    const callbacks = this.deploymentCallbacks.get(moduleId) || [];
    for (const callback of callbacks) {
      try {
        await callback('post-swap', { moduleId, module });
      } catch (error) {
        console.error(`Post-swap callback failed for ${moduleId}:`, error);
      }
    }
  }

  /**
   * Trigger post-load callbacks
   */
  private async triggerPostLoadCallbacks(moduleId: string, module: LoadedModule): Promise<void> {
    const callbacks = this.deploymentCallbacks.get(moduleId) || [];
    for (const callback of callbacks) {
      try {
        await callback('post-load', { moduleId, module });
      } catch (error) {
        console.error(`Post-load callback failed for ${moduleId}:`, error);
      }
    }
  }

  /**
   * Get modules available via subscription using database
   */
  private async getSubscriptionModules(tenantId: string): Promise<string[]> {
    try {
      // Get tenant's active subscription
      const { data: subscription } = await supabase
        .from('tenant_subscriptions')
        .select(`
          *,
          subscription_plans(*)
        `)
        .eq('tenant_id', tenantId)
        .eq('status', 'active')
        .single();

      if (!subscription) {
        return [];
      }

      // Get modules available via this subscription plan
      const { data: permissions } = await supabase
        .from('module_permissions')
        .select('module_name')
        .eq('plan_id', subscription.plan_id)
        .eq('is_enabled', true);

      return permissions?.map(p => p.module_name) || [];
    } catch (error) {
      console.error(`Error getting subscription modules for tenant ${tenantId}:`, error);
      return [];
    }
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
  private async getTenantModuleConfig(tenantId: string): Promise<Record<string, unknown>> {
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
