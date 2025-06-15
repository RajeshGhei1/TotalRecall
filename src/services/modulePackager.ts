
import { ModuleManifest } from '@/types/modules';
import { supabase } from '@/integrations/supabase/client';

export interface ModulePackage {
  id: string;
  manifest: ModuleManifest;
  assets: ModuleAsset[];
  dependencies: string[];
  packageHash: string;
  size: number;
  createdAt: Date;
}

export interface ModuleAsset {
  path: string;
  content: string;
  type: 'component' | 'service' | 'hook' | 'route' | 'style';
  dependencies: string[];
}

export interface PackageValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  compatibilityIssues: string[];
}

export class ModulePackager {
  private static instance: ModulePackager;

  static getInstance(): ModulePackager {
    if (!ModulePackager.instance) {
      ModulePackager.instance = new ModulePackager();
    }
    return ModulePackager.instance;
  }

  /**
   * Package a module for deployment
   */
  async packageModule(moduleId: string, version: string): Promise<ModulePackage> {
    console.log(`Packaging module ${moduleId} version ${version}`);

    try {
      // Load module manifest
      const manifest = await this.loadModuleManifest(moduleId);
      if (!manifest) {
        throw new Error(`Module manifest not found: ${moduleId}`);
      }

      // Update manifest version
      manifest.version = version;

      // Collect module assets
      const assets = await this.collectModuleAssets(moduleId, manifest);

      // Resolve dependencies
      const dependencies = await this.resolveDependencies(manifest);

      // Calculate package hash
      const packageHash = await this.calculatePackageHash(manifest, assets);

      // Calculate package size
      const size = this.calculatePackageSize(assets);

      const modulePackage: ModulePackage = {
        id: `${moduleId}@${version}`,
        manifest,
        assets,
        dependencies,
        packageHash,
        size,
        createdAt: new Date()
      };

      // Validate package
      const validation = await this.validatePackage(modulePackage);
      if (!validation.isValid) {
        throw new Error(`Package validation failed: ${validation.errors.join(', ')}`);
      }

      console.log(`Successfully packaged module ${moduleId}@${version}`);
      return modulePackage;

    } catch (error) {
      console.error(`Error packaging module ${moduleId}:`, error);
      throw error;
    }
  }

  /**
   * Validate a module package
   */
  async validatePackage(modulePackage: ModulePackage): Promise<PackageValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const compatibilityIssues: string[] = [];

    // Validate manifest
    if (!modulePackage.manifest.id) {
      errors.push('Module ID is required');
    }

    if (!modulePackage.manifest.version) {
      errors.push('Module version is required');
    }

    // Validate version format
    if (!/^\d+\.\d+\.\d+$/.test(modulePackage.manifest.version)) {
      errors.push('Invalid version format. Use semantic versioning (x.y.z)');
    }

    // Validate dependencies exist
    for (const dep of modulePackage.dependencies) {
      const depExists = await this.checkDependencyExists(dep);
      if (!depExists) {
        errors.push(`Dependency not found: ${dep}`);
      }
    }

    // Check for circular dependencies
    const circularDeps = await this.detectCircularDependencies(modulePackage.manifest);
    if (circularDeps.length > 0) {
      errors.push(`Circular dependencies detected: ${circularDeps.join(' -> ')}`);
    }

    // Validate core version compatibility
    const coreCompatible = await this.checkCoreCompatibility(modulePackage.manifest);
    if (!coreCompatible) {
      compatibilityIssues.push('Module may not be compatible with current core version');
    }

    // Check for asset integrity
    for (const asset of modulePackage.assets) {
      if (!asset.content || asset.content.trim().length === 0) {
        warnings.push(`Empty asset detected: ${asset.path}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      compatibilityIssues
    };
  }

  /**
   * Check version compatibility
   */
  async checkVersionCompatibility(
    currentVersion: string, 
    newVersion: string
  ): Promise<{ compatible: boolean; breaking: boolean }> {
    const current = this.parseVersion(currentVersion);
    const target = this.parseVersion(newVersion);

    // Major version change indicates breaking changes
    const breaking = current.major !== target.major;
    
    // Compatible if new version is greater and not breaking
    const compatible = !breaking && (
      target.major > current.major ||
      (target.major === current.major && target.minor > current.minor) ||
      (target.major === current.major && target.minor === current.minor && target.patch > current.patch)
    );

    return { compatible, breaking };
  }

  /**
   * Load module manifest from file system or database
   */
  private async loadModuleManifest(moduleId: string): Promise<ModuleManifest | null> {
    try {
      // Try to load from module directory first
      const manifestPath = `/src/modules/${moduleId}/manifest.json`;
      const response = await fetch(manifestPath);
      if (response.ok) {
        return await response.json();
      }

      // Fallback to database
      const { data, error } = await supabase
        .from('system_modules')
        .select('*')
        .eq('id', moduleId)
        .single();

      if (error) throw error;
      
      // Convert database record to manifest format
      return this.convertToManifest(data);
    } catch (error) {
      console.error(`Error loading manifest for ${moduleId}:`, error);
      return null;
    }
  }

  /**
   * Collect all module assets
   */
  private async collectModuleAssets(moduleId: string, manifest: ModuleManifest): Promise<ModuleAsset[]> {
    const assets: ModuleAsset[] = [];

    // Collect components
    if (manifest.components) {
      for (const component of manifest.components) {
        const content = await this.loadAssetContent(`/src/modules/${moduleId}/${component.path}`);
        assets.push({
          path: component.path,
          content,
          type: 'component',
          dependencies: component.exports || []
        });
      }
    }

    // Collect services
    if (manifest.services) {
      for (const service of manifest.services) {
        const content = await this.loadAssetContent(`/src/modules/${moduleId}/${service.path}`);
        assets.push({
          path: service.path,
          content,
          type: 'service',
          dependencies: service.dependencies || []
        });
      }
    }

    // Collect hooks
    if (manifest.hooks) {
      for (const hook of manifest.hooks) {
        const content = await this.loadAssetContent(`/src/modules/${moduleId}/${hook.path}`);
        assets.push({
          path: hook.path,
          content,
          type: 'hook',
          dependencies: hook.dependencies || []
        });
      }
    }

    // Collect entry point
    const entryContent = await this.loadAssetContent(`/src/modules/${moduleId}/${manifest.entryPoint}`);
    assets.push({
      path: manifest.entryPoint,
      content: entryContent,
      type: 'component',
      dependencies: []
    });

    return assets;
  }

  /**
   * Load asset content from file system
   */
  private async loadAssetContent(path: string): Promise<string> {
    try {
      const response = await fetch(path);
      if (response.ok) {
        return await response.text();
      }
      return '';
    } catch (error) {
      console.warn(`Could not load asset: ${path}`);
      return '';
    }
  }

  /**
   * Resolve module dependencies
   */
  private async resolveDependencies(manifest: ModuleManifest): Promise<string[]> {
    const dependencies = [...manifest.dependencies];
    
    // Add peer dependencies
    if (manifest.peerDependencies) {
      dependencies.push(...manifest.peerDependencies);
    }

    return [...new Set(dependencies)]; // Remove duplicates
  }

  /**
   * Calculate package hash for integrity checking
   */
  private async calculatePackageHash(manifest: ModuleManifest, assets: ModuleAsset[]): Promise<string> {
    const content = JSON.stringify({ manifest, assets });
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Calculate total package size
   */
  private calculatePackageSize(assets: ModuleAsset[]): number {
    return assets.reduce((total, asset) => total + asset.content.length, 0);
  }

  /**
   * Check if dependency exists
   */
  private async checkDependencyExists(dependency: string): Promise<boolean> {
    // Check if dependency is a core module or available module
    try {
      const { data, error } = await supabase
        .from('system_modules')
        .select('id')
        .eq('id', dependency)
        .single();

      return !error && !!data;
    } catch {
      return false;
    }
  }

  /**
   * Detect circular dependencies
   */
  private async detectCircularDependencies(manifest: ModuleManifest): Promise<string[]> {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    const cycles: string[] = [];

    const dfs = async (moduleId: string, path: string[]): Promise<void> => {
      if (recursionStack.has(moduleId)) {
        const cycleStart = path.indexOf(moduleId);
        cycles.push(path.slice(cycleStart).join(' -> ') + ' -> ' + moduleId);
        return;
      }

      if (visited.has(moduleId)) {
        return;
      }

      visited.add(moduleId);
      recursionStack.add(moduleId);

      // Check dependencies
      for (const dep of manifest.dependencies) {
        await dfs(dep, [...path, moduleId]);
      }

      recursionStack.delete(moduleId);
    };

    await dfs(manifest.id, []);
    return cycles;
  }

  /**
   * Check core version compatibility
   */
  private async checkCoreCompatibility(manifest: ModuleManifest): Promise<boolean> {
    // Get current core version (would be from system configuration)
    const currentCoreVersion = '1.0.0'; // This would come from system config
    
    const minVersion = manifest.minCoreVersion;
    const maxVersion = manifest.maxCoreVersion;

    if (minVersion && !this.isVersionGreaterOrEqual(currentCoreVersion, minVersion)) {
      return false;
    }

    if (maxVersion && !this.isVersionLessOrEqual(currentCoreVersion, maxVersion)) {
      return false;
    }

    return true;
  }

  /**
   * Parse semantic version
   */
  private parseVersion(version: string): { major: number; minor: number; patch: number } {
    const parts = version.split('.').map(Number);
    return {
      major: parts[0] || 0,
      minor: parts[1] || 0,
      patch: parts[2] || 0
    };
  }

  /**
   * Check if version A >= version B
   */
  private isVersionGreaterOrEqual(versionA: string, versionB: string): boolean {
    const a = this.parseVersion(versionA);
    const b = this.parseVersion(versionB);

    return a.major > b.major ||
           (a.major === b.major && a.minor > b.minor) ||
           (a.major === b.major && a.minor === b.minor && a.patch >= b.patch);
  }

  /**
   * Check if version A <= version B
   */
  private isVersionLessOrEqual(versionA: string, versionB: string): boolean {
    const a = this.parseVersion(versionA);
    const b = this.parseVersion(versionB);

    return a.major < b.major ||
           (a.major === b.major && a.minor < b.minor) ||
           (a.major === b.major && a.minor === b.minor && a.patch <= b.patch);
  }

  /**
   * Convert database record to manifest
   */
  private convertToManifest(data: any): ModuleManifest {
    return {
      id: data.id,
      name: data.name,
      version: data.version || '1.0.0',
      description: data.description,
      category: data.category,
      author: data.author || 'System',
      license: 'MIT',
      dependencies: data.dependencies || [],
      entryPoint: 'index.ts',
      requiredPermissions: data.required_permissions || [],
      subscriptionTiers: data.pricing ? [data.pricing.tier] : [],
      loadOrder: 100,
      autoLoad: true,
      canUnload: true,
      minCoreVersion: '1.0.0'
    };
  }
}

export const modulePackager = ModulePackager.getInstance();
