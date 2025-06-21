
import { supabase } from '@/integrations/supabase/client';
import { ModuleManifest } from '@/types/modules';
import { ModuleLoader } from './moduleLoader';
import { ComponentRegistry } from './componentRegistry';
import { DiscoveryResult } from './types';

export class ModuleDiscovery {
  private moduleLoader: ModuleLoader;
  private componentRegistry: ComponentRegistry;

  constructor(moduleLoader: ModuleLoader, componentRegistry: ComponentRegistry) {
    this.moduleLoader = moduleLoader;
    this.componentRegistry = componentRegistry;
  }

  /**
   * Discover and register all available modules
   */
  async discoverAndRegisterModules(): Promise<DiscoveryResult> {
    const registered: string[] = [];
    const failed: { moduleId: string; error: string }[] = [];

    try {
      console.log('🔍 Starting module discovery...');
      
      // Get all system modules from database
      const { data: modules, error } = await supabase
        .from('system_modules')
        .select('*')
        .eq('is_active', true);

      if (error) {
        console.error('❌ Error fetching modules:', error);
        return { registered, failed };
      }

      console.log(`📋 Found ${modules?.length || 0} active modules in database`);

      // Try to load each module
      for (const module of modules || []) {
        try {
          console.log(`🔄 Processing module: ${module.name}`);
          
          const component = await this.moduleLoader.loadModuleComponent(module.name);
          
          if (component) {
            // Create manifest from database module
            const manifest: ModuleManifest = {
              id: module.name,
              name: module.name,
              version: module.version || '1.0.0',
              description: module.description || '',
              category: module.category as any,
              author: 'System',
              license: 'MIT',
              dependencies: module.dependencies || [],
              entryPoint: 'index.tsx',
              requiredPermissions: [],
              subscriptionTiers: [],
              loadOrder: 100,
              autoLoad: module.is_active,
              canUnload: true,
              minCoreVersion: '1.0.0'
            };

            this.componentRegistry.registerComponent(
              module.name,
              component,
              manifest,
              `src/modules/${module.name}/index.tsx`
            );

            registered.push(module.name);
            console.log(`✅ Successfully registered: ${module.name}`);
          } else {
            const errorMsg = 'Component not found';
            failed.push({
              moduleId: module.name,
              error: errorMsg
            });
            console.log(`❌ Failed to register: ${module.name} - ${errorMsg}`);
          }
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          failed.push({
            moduleId: module.name,
            error: errorMsg
          });
          console.error(`❌ Error processing ${module.name}:`, error);
        }
      }

      console.log(`🎯 Module discovery complete: ${registered.length} registered, ${failed.length} failed`);
      return { registered, failed };

    } catch (error) {
      console.error('❌ Error during module discovery:', error);
      return { registered, failed };
    }
  }
}
