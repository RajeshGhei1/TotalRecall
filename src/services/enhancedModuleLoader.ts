
import React from 'react';
import { LoadedModule, ModuleContext, ModuleLoadOptions } from '@/types/modules';
import { supabase } from '@/integrations/supabase/client';
import { useModuleDeployments } from '@/hooks/useModuleDeployments';

class EnhancedModuleLoader {
  private static instance: EnhancedModuleLoader;
  private loadedModules: Map<string, LoadedModule> = new Map();

  static getInstance(): EnhancedModuleLoader {
    if (!EnhancedModuleLoader.instance) {
      EnhancedModuleLoader.instance = new EnhancedModuleLoader();
    }
    return EnhancedModuleLoader.instance;
  }

  async initialize(): Promise<void> {
    console.log('Initializing Enhanced ModuleLoader...');
    await this.loadRegisteredModules();
  }

  private async loadRegisteredModules(): Promise<void> {
    try {
      const { data: modules, error } = await supabase
        .from('system_modules')
        .select('*')
        .eq('is_active', true)
        .eq('auto_load', true)
        .order('load_order');

      if (error) {
        console.error('Error loading registered modules:', error);
        return;
      }

      for (const module of modules || []) {
        try {
          await this.preloadModule(module.name);
        } catch (error) {
          console.error(`Failed to preload module ${module.name}:`, error);
        }
      }
    } catch (error) {
      console.error('Error in loadRegisteredModules:', error);
    }
  }

  async loadModule(moduleId: string, context: ModuleContext, options?: ModuleLoadOptions): Promise<LoadedModule> {
    // Check if already loaded
    const existing = this.loadedModules.get(moduleId);
    if (existing && !options?.force) {
      return existing;
    }

    try {
      // Get module manifest from database
      const manifest = await this.getModuleManifest(moduleId);
      if (!manifest) {
        throw new Error(`Module ${moduleId} not found in registry`);
      }

      // Log deployment event
      await this.logDeploymentEvent(moduleId, 'load', context);

      // Load the module instance
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
        manifest: await this.getModuleManifest(moduleId) || {} as any,
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

  async reloadModule(moduleId: string, context: ModuleContext): Promise<LoadedModule> {
    // Unload existing module
    this.unloadModule(moduleId);
    
    // Log reload event
    await this.logDeploymentEvent(moduleId, 'update', context);
    
    // Load fresh version
    return this.loadModule(moduleId, context, { force: true });
  }

  private async preloadModule(moduleId: string): Promise<void> {
    try {
      const context: ModuleContext = {
        moduleId,
        tenantId: 'system',
        userId: 'system',
        permissions: ['read'],
        config: {}
      };

      await this.loadModule(moduleId, context);
    } catch (error) {
      console.error(`Failed to preload module ${moduleId}:`, error);
    }
  }

  private async getModuleManifest(moduleId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('system_modules')
        .select('*')
        .eq('name', moduleId)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching module manifest:', error);
        return null;
      }

      return {
        id: data.name,
        name: data.name,
        version: data.version || '1.0.0',
        description: data.description || '',
        category: data.category,
        author: data.author || 'System',
        license: data.license || 'MIT',
        dependencies: data.dependencies || [],
        entryPoint: data.entry_point || 'index.tsx',
        requiredPermissions: data.required_permissions || ['read'],
        subscriptionTiers: data.subscription_tiers || ['basic', 'pro', 'enterprise'],
        loadOrder: data.load_order || 100,
        autoLoad: data.auto_load || false,
        canUnload: data.can_unload !== false,
        minCoreVersion: data.min_core_version || '1.0.0'
      };
    } catch (error) {
      console.error('Error in getModuleManifest:', error);
      return null;
    }
  }

  private async logDeploymentEvent(moduleId: string, type: string, context: ModuleContext): Promise<void> {
    try {
      await supabase
        .from('module_deployments')
        .insert({
          module_name: moduleId,
          version: '1.0.0',
          deployment_type: type,
          status: 'completed',
          tenant_id: context.tenantId,
          deployed_by: context.userId,
          deployment_config: context.config,
          deployment_log: [{
            timestamp: new Date().toISOString(),
            event: `Module ${type} completed`,
            details: { moduleId, context }
          }]
        });
    } catch (error) {
      console.warn('Failed to log deployment event:', error);
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

export const enhancedModuleLoader = EnhancedModuleLoader.getInstance();
export { EnhancedModuleLoader };
