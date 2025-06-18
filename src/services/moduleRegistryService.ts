
import { ModuleManifest, LoadedModule } from '@/types/modules';
import { supabase } from '@/integrations/supabase/client';

export interface ModuleRegistryEntry {
  id: string;
  name: string;
  version: string;
  manifest: ModuleManifest;
  isActive: boolean;
  registeredAt: Date;
}

class ModuleRegistryService {
  private static instance: ModuleRegistryService;
  private registry: Map<string, ModuleRegistryEntry> = new Map();
  private initialized = false;

  static getInstance(): ModuleRegistryService {
    if (!ModuleRegistryService.instance) {
      ModuleRegistryService.instance = new ModuleRegistryService();
    }
    return ModuleRegistryService.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      await this.loadRegistryFromDatabase();
      this.initialized = true;
      console.log('Module registry initialized');
    } catch (error) {
      console.error('Failed to initialize module registry:', error);
    }
  }

  private async loadRegistryFromDatabase(): Promise<void> {
    try {
      // Load modules from database if the table exists
      const { data: modules, error } = await supabase
        .from('system_modules')
        .select('*')
        .eq('is_active', true);

      if (error) {
        console.warn('Could not load modules from database:', error.message);
        // Fall back to built-in modules
        this.loadBuiltInModules();
        return;
      }

      if (modules) {
        modules.forEach(module => {
          const manifest: ModuleManifest = {
            id: module.name,
            name: module.display_name || module.name,
            version: module.version || '1.0.0',
            description: module.description || '',
            category: module.category,
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

          this.registry.set(module.name, {
            id: module.name,
            name: module.display_name || module.name,
            version: module.version || '1.0.0',
            manifest,
            isActive: module.is_active,
            registeredAt: new Date(module.created_at)
          });
        });
      }
    } catch (error) {
      console.error('Error loading modules from database:', error);
      this.loadBuiltInModules();
    }
  }

  private loadBuiltInModules(): void {
    const builtInModules = [
      {
        id: 'ats-core',
        name: 'ATS Core',
        version: '1.0.0',
        description: 'Core Applicant Tracking System',
        category: 'recruitment'
      },
      {
        id: 'talent-database',
        name: 'Talent Database',
        version: '1.0.0',
        description: 'Comprehensive talent database',
        category: 'recruitment'
      },
      {
        id: 'smart-talent-analytics',
        name: 'Smart Talent Analytics',
        version: '1.0.0',
        description: 'AI-powered talent analytics',
        category: 'analytics'
      }
    ];

    builtInModules.forEach(module => {
      const manifest: ModuleManifest = {
        id: module.id,
        name: module.name,
        version: module.version,
        description: module.description,
        category: module.category as any,
        author: 'System',
        license: 'MIT',
        dependencies: [],
        entryPoint: 'index.tsx',
        requiredPermissions: ['read'],
        subscriptionTiers: ['basic', 'pro', 'enterprise'],
        loadOrder: 10,
        autoLoad: true,
        canUnload: true,
        minCoreVersion: '1.0.0'
      };

      this.registry.set(module.id, {
        id: module.id,
        name: module.name,
        version: module.version,
        manifest,
        isActive: true,
        registeredAt: new Date()
      });
    });
  }

  async registerModule(manifest: ModuleManifest): Promise<boolean> {
    try {
      const entry: ModuleRegistryEntry = {
        id: manifest.id,
        name: manifest.name,
        version: manifest.version,
        manifest,
        isActive: true,
        registeredAt: new Date()
      };

      this.registry.set(manifest.id, entry);

      // Optionally persist to database
      await this.persistToDatabase(entry);
      
      console.log(`Module registered: ${manifest.id}`);
      return true;
    } catch (error) {
      console.error(`Failed to register module ${manifest.id}:`, error);
      return false;
    }
  }

  async unregisterModule(moduleId: string): Promise<boolean> {
    try {
      this.registry.delete(moduleId);
      
      // Remove from database if it exists
      await supabase
        .from('system_modules')
        .delete()
        .eq('name', moduleId);

      console.log(`Module unregistered: ${moduleId}`);
      return true;
    } catch (error) {
      console.error(`Failed to unregister module ${moduleId}:`, error);
      return false;
    }
  }

  getModule(moduleId: string): ModuleRegistryEntry | undefined {
    return this.registry.get(moduleId);
  }

  getAllModules(): ModuleRegistryEntry[] {
    return Array.from(this.registry.values());
  }

  getModulesByCategory(category: string): ModuleRegistryEntry[] {
    return this.getAllModules().filter(module => 
      module.manifest.category === category
    );
  }

  isModuleRegistered(moduleId: string): boolean {
    return this.registry.has(moduleId);
  }

  getModuleManifest(moduleId: string): ModuleManifest | undefined {
    return this.registry.get(moduleId)?.manifest;
  }

  private async persistToDatabase(entry: ModuleRegistryEntry): Promise<void> {
    try {
      const { error } = await supabase
        .from('system_modules')
        .upsert({
          name: entry.id,
          display_name: entry.name,
          version: entry.version,
          description: entry.manifest.description,
          category: entry.manifest.category,
          dependencies: entry.manifest.dependencies,
          required_permissions: entry.manifest.requiredPermissions,
          pricing_tier: entry.manifest.subscriptionTiers[0] || 'basic',
          is_active: entry.isActive,
          created_at: entry.registeredAt.toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.warn('Could not persist module to database:', error.message);
      }
    } catch (error) {
      console.warn('Database persistence failed:', error);
    }
  }

  async refreshRegistry(): Promise<void> {
    this.registry.clear();
    this.initialized = false;
    await this.initialize();
  }
}

export const moduleRegistryService = ModuleRegistryService.getInstance();
