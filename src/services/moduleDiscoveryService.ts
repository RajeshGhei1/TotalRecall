
import { ModuleManifest, LoadedModule } from '@/types/modules';
import { ModuleInitializer } from './moduleDiscovery/moduleInitializer';
import { DiscoveryEngine } from './moduleDiscovery/discoveryEngine';
import { DiscoveryResult } from './moduleDiscovery/types';

export class ModuleDiscoveryService {
  private static instance: ModuleDiscoveryService;
  private initializer: ModuleInitializer;
  private discoveryEngine: DiscoveryEngine;
  private templates: Record<string, unknown> = {};

  private constructor() {
    this.initializer = new ModuleInitializer();
    this.initializeBuiltInModules();
  }

  public static getInstance(): ModuleDiscoveryService {
    if (!ModuleDiscoveryService.instance) {
      ModuleDiscoveryService.instance = new ModuleDiscoveryService();
    }
    return ModuleDiscoveryService.instance;
  }

  private async initializeBuiltInModules() {
    await this.initializer.initializeBuiltInModules();
    this.discoveryEngine = new DiscoveryEngine(this.initializer.getModules());
  }

  initializeKnownModules(): void {
    console.log('🔧 Initializing known modules...');
    // This method is called to ensure modules are ready
    // The actual initialization happens in the constructor
  }

  getModuleFileInfo(moduleId: string): { path: string; exists: boolean } | null {
    const info = this.initializer.getModuleFileInfo().get(moduleId);
    if (info) {
      console.log(`📂 Module file info for ${moduleId}: ${info.path}`);
      return info;
    }
    
    console.log(`❌ No file info found for module: ${moduleId}`);
    return null;
  }

  async discoverAndLoadModules(): Promise<DiscoveryResult> {
    return this.discoveryEngine.discoverAndLoadModules();
  }

  async loadModule(moduleId: string, options?: unknown): Promise<LoadedModule | undefined> {
    return this.discoveryEngine.loadModule(moduleId, options);
  }

  async unloadModule(moduleId: string): Promise<boolean> {
    const modules = this.initializer.getModules();
    if (!modules.has(moduleId)) {
      console.warn(`⚠️ Module "${moduleId}" is not loaded.`);
      return false;
    }

    try {
      modules.delete(moduleId);
      console.log(`✅ Module "${moduleId}" unloaded successfully.`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to unload module "${moduleId}":`, error);
      return false;
    }
  }

  getModule(moduleId: string): LoadedModule | undefined {
    return this.initializer.getModules().get(moduleId);
  }

  getModules(): Map<string, LoadedModule> {
    return this.initializer.getModules();
  }

  getModuleList(): LoadedModule[] {
    return Array.from(this.initializer.getModules().values());
  }

  getModuleManifest(moduleId: string): ModuleManifest | undefined {
    const module = this.initializer.getModules().get(moduleId);
    return module?.manifest;
  }

  getModulePath(moduleId: string): string | undefined {
    const fileInfo = this.initializer.getModuleFileInfo().get(moduleId);
    return fileInfo?.path;
  }

  registerTemplate(templateId: string, template: unknown): void {
    if (this.templates[templateId]) {
      console.warn(`⚠️ Template with id "${templateId}" already registered.`);
    }
    this.templates[templateId] = template;
  }

  getTemplate(templateId: string): unknown | undefined {
    return this.templates[templateId];
  }
}

export const moduleDiscoveryService = ModuleDiscoveryService.getInstance();

// Export types for backward compatibility
export type { BuiltInModuleConfig } from './moduleDiscovery/types';
