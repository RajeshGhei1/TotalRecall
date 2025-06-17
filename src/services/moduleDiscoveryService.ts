import { ModuleManifest } from '@/types/modules';
import { moduleCodeRegistry } from './moduleCodeRegistry';

export interface ModuleFileInfo {
  path: string;
  moduleId: string;
  directoryName: string;
}

export class ModuleDiscoveryService {
  private static instance: ModuleDiscoveryService;
  private knownModules: Map<string, ModuleFileInfo> = new Map();

  static getInstance(): ModuleDiscoveryService {
    if (!ModuleDiscoveryService.instance) {
      ModuleDiscoveryService.instance = new ModuleDiscoveryService();
    }
    return ModuleDiscoveryService.instance;
  }

  /**
   * Initialize known modules - hardcoded list of available modules
   */
  initializeKnownModules(): void {
    const modules: ModuleFileInfo[] = [
      // Core Infrastructure
      { path: '/src/modules/core-dashboard/index.tsx', moduleId: 'core-dashboard', directoryName: 'core-dashboard' },
      { path: '/src/modules/email-management/index.tsx', moduleId: 'email-management', directoryName: 'email-management' },
      { path: '/src/modules/ai-orchestration/index.tsx', moduleId: 'ai-orchestration', directoryName: 'ai-orchestration' },
      
      // ATS Ecosystem
      { path: '/src/modules/ats-core/index.tsx', moduleId: 'ats-core', directoryName: 'ats-core' },
      { path: '/src/modules/talent-database/index.tsx', moduleId: 'talent-database', directoryName: 'talent-database' },
      
      // Existing modules (already in src/modules/)
      { path: '/src/modules/dashboard-widget/index.tsx', moduleId: 'dashboard-widget', directoryName: 'dashboard-widget' },
      { path: '/src/modules/contact-form/index.tsx', moduleId: 'contact-form', directoryName: 'contact-form' },
      { path: '/src/modules/analytics-panel/index.tsx', moduleId: 'analytics-panel', directoryName: 'analytics-panel' },
    ];

    modules.forEach(module => {
      this.knownModules.set(module.moduleId, module);
    });

    console.log(`Initialized ${modules.length} known modules`);
  }

  /**
   * Discover and load all known modules
   */
  async discoverAndLoadModules(): Promise<{
    loaded: string[];
    failed: { moduleId: string; error: string }[];
  }> {
    const loaded: string[] = [];
    const failed: { moduleId: string; error: string }[] = [];

    if (this.knownModules.size === 0) {
      this.initializeKnownModules();
    }

    for (const [moduleId, moduleInfo] of this.knownModules) {
      try {
        console.log(`Attempting to load module: ${moduleId}`);
        
        // Try to dynamically import the module
        const moduleExports = await import(moduleInfo.path);
        const component = moduleExports.default;
        
        if (component) {
          // Extract metadata from component
          const metadata = (component as any).moduleMetadata;
          
          if (metadata) {
            // Create manifest from metadata
            const manifest: ModuleManifest = {
              id: metadata.id || moduleId,
              name: metadata.name || moduleId,
              version: metadata.version || '1.0.0',
              description: metadata.description || '',
              category: metadata.category || 'custom',
              author: metadata.author || 'System',
              license: 'MIT',
              dependencies: metadata.dependencies || [],
              entryPoint: 'index.tsx',
              requiredPermissions: metadata.requiredPermissions || [],
              subscriptionTiers: [],
              loadOrder: 100,
              autoLoad: true,
              canUnload: true,
              minCoreVersion: '1.0.0'
            };

            // Register the component
            moduleCodeRegistry.registerComponent(
              moduleId,
              component,
              manifest,
              moduleInfo.path
            );

            loaded.push(moduleId);
            console.log(`Successfully loaded module: ${moduleId}`);
          } else {
            console.warn(`Module ${moduleId} missing metadata`);
            // Still register without full metadata
            const basicManifest: ModuleManifest = {
              id: moduleId,
              name: moduleId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              version: '1.0.0',
              description: `Module: ${moduleId}`,
              category: 'custom',
              author: 'System',
              license: 'MIT',
              dependencies: [],
              entryPoint: 'index.tsx',
              requiredPermissions: [],
              subscriptionTiers: [],
              loadOrder: 100,
              autoLoad: true,
              canUnload: true,
              minCoreVersion: '1.0.0'
            };

            moduleCodeRegistry.registerComponent(
              moduleId,
              component,
              basicManifest,
              moduleInfo.path
            );

            loaded.push(moduleId);
          }
        } else {
          failed.push({
            moduleId,
            error: 'No default export found'
          });
        }
      } catch (error) {
        console.error(`Error loading module ${moduleId}:`, error);
        failed.push({
          moduleId,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    console.log(`Module discovery completed: ${loaded.length} loaded, ${failed.length} failed`);
    return { loaded, failed };
  }

  /**
   * Get all known module IDs
   */
  getKnownModuleIds(): string[] {
    return Array.from(this.knownModules.keys());
  }

  /**
   * Add a new module to the known modules list
   */
  addKnownModule(moduleInfo: ModuleFileInfo): void {
    this.knownModules.set(moduleInfo.moduleId, moduleInfo);
  }

  /**
   * Check if a module is known
   */
  isKnownModule(moduleId: string): boolean {
    return this.knownModules.has(moduleId);
  }

  /**
   * Get module file info
   */
  getModuleFileInfo(moduleId: string): ModuleFileInfo | null {
    return this.knownModules.get(moduleId) || null;
  }
}

export const moduleDiscoveryService = ModuleDiscoveryService.getInstance();
