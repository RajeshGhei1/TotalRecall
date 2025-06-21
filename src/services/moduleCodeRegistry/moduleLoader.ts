
export class ModuleLoader {
  private componentCache: Map<string, React.ComponentType<any>> = new Map();

  /**
   * Dynamically load a module component using proper Vite import paths
   */
  async loadModuleComponent(moduleId: string): Promise<React.ComponentType<any> | null> {
    try {
      console.log(`🔍 Loading module component: ${moduleId}`);
      
      // Check cache first
      if (this.componentCache.has(moduleId)) {
        console.log(`✅ Found ${moduleId} in cache`);
        return this.componentCache.get(moduleId)!;
      }

      // Use proper Vite-compatible import paths (relative from src/)
      const importPaths = [
        `../modules/${moduleId}/index.tsx`,
        `../modules/${moduleId}/Component.tsx`,
        `../modules/${moduleId}/${moduleId}.tsx`,
        `./modules/${moduleId}.tsx`
      ];

      for (const importPath of importPaths) {
        try {
          console.log(`🔄 Attempting to import: ${importPath}`);
          
          // Use dynamic import with proper path resolution
          const moduleExports = await import(/* @vite-ignore */ importPath);
          const component = moduleExports.default || moduleExports[moduleId];
          
          if (component && typeof component === 'function') {
            console.log(`✅ Successfully loaded module from: ${importPath}`);
            this.componentCache.set(moduleId, component);
            return component;
          } else {
            console.warn(`⚠️ No valid component found at: ${importPath}`);
          }
        } catch (importError) {
          console.log(`❌ Failed to import from ${importPath}:`, importError.message);
          // Continue to next path
        }
      }

      console.error(`❌ No component found for module: ${moduleId}`);
      return null;

    } catch (error) {
      console.error(`❌ Error loading module component ${moduleId}:`, error);
      return null;
    }
  }

  /**
   * Get a cached component
   */
  getCachedComponent(moduleId: string): React.ComponentType<any> | null {
    return this.componentCache.get(moduleId) || null;
  }

  /**
   * Cache a component
   */
  cacheComponent(moduleId: string, component: React.ComponentType<any>): void {
    this.componentCache.set(moduleId, component);
  }

  /**
   * Remove component from cache
   */
  removeCachedComponent(moduleId: string): void {
    this.componentCache.delete(moduleId);
  }

  /**
   * Clear all cached components
   */
  clearCache(): void {
    this.componentCache.clear();
  }
}
