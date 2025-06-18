
import { ModuleManifest, LoadedModule } from '@/types/modules';

export interface ModuleRegistryEntry {
  id: string;
  name: string;
  version: string;
  manifest: ModuleManifest;
  isActive: boolean;
  registeredAt: Date;
}

export interface ModuleInstallation {
  id: string;
  moduleId: string;
  tenantId: string;
  installedAt: Date;
  version: string;
  status: 'active' | 'inactive' | 'error';
  configuration: Record<string, any>;
}

class ModuleRegistryService {
  private static instance: ModuleRegistryService;
  private registry: Map<string, ModuleRegistryEntry> = new Map();
  private installations: Map<string, ModuleInstallation> = new Map();
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
      this.loadBuiltInModules();
      this.initialized = true;
      console.log('Module registry initialized');
    } catch (error) {
      console.error('Failed to initialize module registry:', error);
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

      // Create mock installation
      this.installations.set(module.id, {
        id: module.id,
        moduleId: module.id,
        tenantId: 'default',
        installedAt: new Date(),
        version: module.version,
        status: 'active',
        configuration: {}
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
      this.installations.delete(moduleId);
      
      console.log(`Module unregistered: ${moduleId}`);
      return true;
    } catch (error) {
      console.error(`Failed to unregister module ${moduleId}:`, error);
      return false;
    }
  }

  async uninstallModule(moduleId: string): Promise<boolean> {
    try {
      const installation = this.installations.get(moduleId);
      if (installation) {
        installation.status = 'inactive';
        this.installations.set(moduleId, installation);
      }
      
      console.log(`Module uninstalled: ${moduleId}`);
      return true;
    } catch (error) {
      console.error(`Failed to uninstall module ${moduleId}:`, error);
      return false;
    }
  }

  getModule(moduleId: string): ModuleRegistryEntry | undefined {
    return this.registry.get(moduleId);
  }

  getAllModules(): ModuleRegistryEntry[] {
    return Array.from(this.registry.values());
  }

  getInstalledModules(): ModuleInstallation[] {
    return Array.from(this.installations.values()).filter(
      installation => installation.status === 'active'
    );
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

  async refreshRegistry(): Promise<void> {
    this.registry.clear();
    this.installations.clear();
    this.initialized = false;
    await this.initialize();
  }
}

export const moduleRegistryService = ModuleRegistryService.getInstance();
