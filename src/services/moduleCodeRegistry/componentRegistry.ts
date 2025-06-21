
import { ModuleManifest } from '@/types/modules';
import { ModuleComponent } from './types';

export class ComponentRegistry {
  private registeredComponents: Map<string, ModuleComponent> = new Map();

  /**
   * Register a React component as a module
   */
  registerComponent(
    moduleId: string,
    component: React.ComponentType<any>,
    manifest: ModuleManifest,
    path: string
  ): void {
    const moduleComponent: ModuleComponent = {
      id: moduleId,
      name: manifest.name,
      component,
      manifest,
      path
    };

    this.registeredComponents.set(moduleId, moduleComponent);
    
    console.log(`✅ Registered module component: ${moduleId} (${manifest.name})`);
  }

  /**
   * Get module component metadata
   */
  getModuleComponent(moduleId: string): ModuleComponent | null {
    return this.registeredComponents.get(moduleId) || null;
  }

  /**
   * Get all registered modules
   */
  getAllRegisteredModules(): ModuleComponent[] {
    return Array.from(this.registeredComponents.values());
  }

  /**
   * Unregister a module component
   */
  unregisterComponent(moduleId: string): boolean {
    const wasRegistered = this.registeredComponents.has(moduleId);
    this.registeredComponents.delete(moduleId);
    
    if (wasRegistered) {
      console.log(`🗑️ Unregistered module component: ${moduleId}`);
    }
    
    return wasRegistered;
  }

  /**
   * Clear all registrations
   */
  clearAll(): void {
    this.registeredComponents.clear();
    console.log('🧹 Cleared all module registrations');
  }

  /**
   * Check if a module is registered
   */
  isRegistered(moduleId: string): boolean {
    return this.registeredComponents.has(moduleId);
  }
}
