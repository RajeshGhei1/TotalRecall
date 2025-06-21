import { ModuleManifest, LoadedModule } from '@/types/modules';

export interface BuiltInModuleConfig {
  id: string;
  name: string;
  path: string;
  category: 'core' | 'business' | 'recruitment' | 'analytics' | 'ai' | 'integration' | 'communication' | 'custom';
  version: string;
  description: string;
  author: string;
  dependencies: string[];
  loadOrder: number;
}

export class ModuleDiscoveryService {
  private static instance: ModuleDiscoveryService;
  private modules: Map<string, LoadedModule> = new Map();
  private templates: Record<string, any> = {};
  private moduleFileInfo: Map<string, { path: string; exists: boolean }> = new Map();

  private constructor() {
    this.initializeBuiltInModules();
  }

  public static getInstance(): ModuleDiscoveryService {
    if (!ModuleDiscoveryService.instance) {
      ModuleDiscoveryService.instance = new ModuleDiscoveryService();
    }
    return ModuleDiscoveryService.instance;
  }

  private async initializeBuiltInModules() {
    console.log('🔧 Initializing built-in modules...');
    
    const builtInModules = [
      {
        id: 'ats-core',
        name: 'ATS Core',
        path: '../modules/ats-core/index.tsx',
        category: 'recruitment' as const,
        version: '1.0.0',
        description: 'Core Applicant Tracking System with job and candidate management',
        author: 'System',
        dependencies: [],
        loadOrder: 10
      },
      {
        id: 'talent-database',
        name: 'Talent Database',
        path: '../modules/talent-database/index.tsx',
        category: 'recruitment' as const,
        version: '1.0.0',
        description: 'Comprehensive talent database with search, favorites, and analytics',
        author: 'System',
        dependencies: ['ats-core'],
        loadOrder: 20
      },
      {
        id: 'smart-talent-analytics',
        name: 'Smart Talent Analytics',
        path: '../modules/smart-talent-analytics/index.tsx',
        category: 'analytics' as const,
        version: '1.0.0',
        description: 'AI-powered talent analytics with predictive insights, pattern analysis, and talent matching',
        author: 'System',
        dependencies: ['ats-core', 'talent-database'],
        loadOrder: 30
      },
      {
        id: 'companies',
        name: 'Companies',
        path: '../modules/companies/index.tsx',
        category: 'business' as const,
        version: '1.0.0',
        description: 'Comprehensive company management and relationship tracking with advanced features including hierarchical relationships, bulk operations, and analytics',
        author: 'System',
        dependencies: [],
        loadOrder: 40
      },
      {
        id: 'people',
        name: 'People',
        path: '../modules/people/index.tsx',
        category: 'business' as const,
        version: '1.0.0',
        description: 'Advanced people and contact management system with talent database, business contacts, and relationship tracking capabilities',
        author: 'System',
        dependencies: [],
        loadOrder: 50
      }
    ];

    for (const moduleConfig of builtInModules) {
      try {
        const manifest: ModuleManifest = {
          id: moduleConfig.id,
          name: moduleConfig.name,
          version: moduleConfig.version,
          description: moduleConfig.description,
          category: moduleConfig.category,
          author: moduleConfig.author,
          license: 'MIT',
          dependencies: moduleConfig.dependencies,
          minCoreVersion: '1.0.0',
          entryPoint: 'index.tsx',
          requiredPermissions: ['read'],
          subscriptionTiers: ['basic', 'pro', 'enterprise'],
          loadOrder: moduleConfig.loadOrder,
          autoLoad: true,
          canUnload: true
        };

        const loadedModule: LoadedModule = {
          manifest,
          instance: null,
          status: 'loaded',
          loadedAt: new Date(),
          dependencies: []
        };

        this.modules.set(moduleConfig.id, loadedModule);
        this.moduleFileInfo.set(moduleConfig.id, { 
          path: moduleConfig.path, 
          exists: true 
        });
        
        console.log(`✅ Initialized built-in module: ${moduleConfig.name}`);
      } catch (error) {
        console.error(`❌ Failed to initialize module ${moduleConfig.id}:`, error);
      }
    }
    
    console.log(`🎯 Built-in modules initialization complete: ${this.modules.size} modules`);
  }

  /**
   * Initialize known modules (called by module manager)
   */
  initializeKnownModules(): void {
    console.log('🔧 Initializing known modules...');
    // This method is called to ensure modules are ready
    // The actual initialization happens in the constructor
  }

  /**
   * Get module file information with proper import path
   */
  getModuleFileInfo(moduleId: string): { path: string; exists: boolean } | null {
    const info = this.moduleFileInfo.get(moduleId);
    if (info) {
      console.log(`📂 Module file info for ${moduleId}: ${info.path}`);
      return info;
    }
    
    console.log(`❌ No file info found for module: ${moduleId}`);
    return null;
  }

  /**
   * Discover and load all available modules
   */
  async discoverAndLoadModules(): Promise<{
    loaded: string[];
    failed: { moduleId: string; error: string }[];
  }> {
    console.log('🔍 Starting module discovery...');
    
    const loaded: string[] = [];
    const failed: { moduleId: string; error: string }[] = [];

    for (const [moduleId, module] of this.modules) {
      if (module.status === 'loaded') {
        loaded.push(moduleId);
        console.log(`✅ Module loaded: ${moduleId}`);
      } else {
        const error = 'Module not properly loaded';
        failed.push({ moduleId, error });
        console.log(`❌ Module failed: ${moduleId} - ${error}`);
      }
    }

    console.log(`🎯 Discovery complete: ${loaded.length} loaded, ${failed.length} failed`);
    return { loaded, failed };
  }

  async loadModule(moduleId: string, options?: any): Promise<LoadedModule | undefined> {
    const existingModule = this.modules.get(moduleId);
    if (existingModule && !options?.force) {
      console.warn(`⚠️ Module "${moduleId}" already loaded. Use force option to reload.`);
      return existingModule;
    }

    try {
      console.log(`🔄 Loading module: ${moduleId}`);
      
      // Get the proper module path
      const modulePath = this.getModulePath(moduleId);
      if (!modulePath) {
        throw new Error(`Module path not found for ${moduleId}`);
      }

      console.log(`📂 Attempting to load from: ${modulePath}`);
      const module = await import(/* @vite-ignore */ modulePath);
      const manifest = this.getModuleManifest(moduleId);

      if (!manifest) {
        throw new Error(`Manifest not found for module ${moduleId}`);
      }

      const loadedModule: LoadedModule = {
        manifest: manifest,
        instance: module,
        status: 'loaded',
        loadedAt: new Date(),
        dependencies: []
      };

      this.modules.set(moduleId, loadedModule);
      console.log(`✅ Module "${moduleId}" loaded successfully.`);
      return loadedModule;
    } catch (error) {
      console.error(`❌ Failed to load module "${moduleId}":`, error);
      return undefined;
    }
  }

  async unloadModule(moduleId: string): Promise<boolean> {
    if (!this.modules.has(moduleId)) {
      console.warn(`⚠️ Module "${moduleId}" is not loaded.`);
      return false;
    }

    try {
      this.modules.delete(moduleId);
      console.log(`✅ Module "${moduleId}" unloaded successfully.`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to unload module "${moduleId}":`, error);
      return false;
    }
  }

  getModule(moduleId: string): LoadedModule | undefined {
    return this.modules.get(moduleId);
  }

  getModules(): Map<string, LoadedModule> {
    return this.modules;
  }

  getModuleList(): LoadedModule[] {
    return Array.from(this.modules.values());
  }

  getModuleManifest(moduleId: string): ModuleManifest | undefined {
    const module = this.modules.get(moduleId);
    return module?.manifest;
  }

  getModulePath(moduleId: string): string | undefined {
    const fileInfo = this.moduleFileInfo.get(moduleId);
    return fileInfo?.path;
  }

  registerTemplate(templateId: string, template: any): void {
    if (this.templates[templateId]) {
      console.warn(`⚠️ Template with id "${templateId}" already registered.`);
    }
    this.templates[templateId] = template;
  }

  getTemplate(templateId: string): any | undefined {
    return this.templates[templateId];
  }
}

export const moduleDiscoveryService = ModuleDiscoveryService.getInstance();
