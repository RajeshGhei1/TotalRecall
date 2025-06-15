
import { ModuleManifest } from '@/types/modules';
import { modulePackager } from './modulePackager';
import { moduleRepository } from './moduleRepository';
import { moduleManager } from './moduleManager';

export interface VersionInfo {
  current: string;
  available: string[];
  latest: string;
  canUpgrade: boolean;
  breaking: boolean;
}

export interface HotSwapResult {
  success: boolean;
  oldVersion: string;
  newVersion: string;
  rollbackAvailable: boolean;
  error?: string;
}

export class ModuleVersionManager {
  private static instance: ModuleVersionManager;

  static getInstance(): ModuleVersionManager {
    if (!ModuleVersionManager.instance) {
      ModuleVersionManager.instance = new ModuleVersionManager();
    }
    return ModuleVersionManager.instance;
  }

  /**
   * Get version information for a module
   */
  async getVersionInfo(moduleId: string): Promise<VersionInfo | null> {
    try {
      // Get current version from loaded modules
      const currentModule = moduleManager.getModuleForTenant(moduleId, 'current-tenant');
      const currentVersion = currentModule?.manifest.version || '1.0.0';

      // Get available versions from repository
      const repositoryModules = await moduleRepository.getRepositoryModules();
      const moduleVersions = repositoryModules
        .filter(entry => entry.moduleId === moduleId && entry.status === 'approved')
        .map(entry => entry.version)
        .sort(this.compareVersions);

      const latestVersion = moduleVersions[moduleVersions.length - 1] || currentVersion;

      // Check if upgrade is available and if it's breaking
      const canUpgrade = this.compareVersions(latestVersion, currentVersion) > 0;
      const compatibility = await modulePackager.checkVersionCompatibility(currentVersion, latestVersion);

      return {
        current: currentVersion,
        available: moduleVersions,
        latest: latestVersion,
        canUpgrade,
        breaking: compatibility.breaking
      };

    } catch (error) {
      console.error(`Error getting version info for ${moduleId}:`, error);
      return null;
    }
  }

  /**
   * Hot-swap a module to a new version
   */
  async hotSwapModule(
    moduleId: string, 
    targetVersion: string, 
    tenantId: string
  ): Promise<HotSwapResult> {
    console.log(`Hot-swapping module ${moduleId} to version ${targetVersion}`);

    try {
      // Get current version
      const currentModule = moduleManager.getModuleForTenant(moduleId, tenantId);
      const currentVersion = currentModule?.manifest.version || '1.0.0';

      if (currentVersion === targetVersion) {
        return {
          success: true,
          oldVersion: currentVersion,
          newVersion: targetVersion,
          rollbackAvailable: false
        };
      }

      // Check if target version is available
      const targetEntry = await moduleRepository.getRepositoryEntryByVersion(moduleId, targetVersion);
      if (!targetEntry || targetEntry.status !== 'deployed') {
        throw new Error(`Target version ${targetVersion} is not available for deployment`);
      }

      // Check version compatibility
      const compatibility = await modulePackager.checkVersionCompatibility(currentVersion, targetVersion);
      if (compatibility.breaking) {
        console.warn(`Hot-swap involves breaking changes from ${currentVersion} to ${targetVersion}`);
      }

      // Create backup of current state
      const rollbackId = await this.createHotSwapBackup(moduleId, tenantId);

      try {
        // Perform hot-swap using module manager
        const newModule = await moduleManager.hotSwapModule(moduleId, targetVersion, tenantId);

        console.log(`Successfully hot-swapped ${moduleId} from ${currentVersion} to ${targetVersion}`);
        
        return {
          success: true,
          oldVersion: currentVersion,
          newVersion: targetVersion,
          rollbackAvailable: !!rollbackId
        };

      } catch (swapError) {
        console.error(`Hot-swap failed for ${moduleId}:`, swapError);

        // Attempt rollback
        if (rollbackId) {
          try {
            await this.rollbackHotSwap(moduleId, tenantId, rollbackId);
            console.log(`Successfully rolled back ${moduleId} to ${currentVersion}`);
          } catch (rollbackError) {
            console.error(`Rollback also failed for ${moduleId}:`, rollbackError);
          }
        }

        return {
          success: false,
          oldVersion: currentVersion,
          newVersion: targetVersion,
          rollbackAvailable: false,
          error: swapError instanceof Error ? swapError.message : 'Hot-swap failed'
        };
      }

    } catch (error) {
      console.error(`Error during hot-swap of ${moduleId}:`, error);
      return {
        success: false,
        oldVersion: 'unknown',
        newVersion: targetVersion,
        rollbackAvailable: false,
        error: error instanceof Error ? error.message : 'Hot-swap failed'
      };
    }
  }

  /**
   * Rollback a module to a previous version
   */
  async rollbackModule(
    moduleId: string, 
    targetVersion: string, 
    tenantId: string
  ): Promise<HotSwapResult> {
    console.log(`Rolling back module ${moduleId} to version ${targetVersion}`);

    // Use hot-swap mechanism for rollback
    return this.hotSwapModule(moduleId, targetVersion, tenantId);
  }

  /**
   * Check for module updates
   */
  async checkForUpdates(moduleId: string): Promise<{
    hasUpdates: boolean;
    availableVersion?: string;
    breaking: boolean;
    updateDescription?: string;
  }> {
    try {
      const versionInfo = await this.getVersionInfo(moduleId);
      if (!versionInfo) {
        return { hasUpdates: false, breaking: false };
      }

      const hasUpdates = versionInfo.canUpgrade;
      const compatibility = await modulePackager.checkVersionCompatibility(
        versionInfo.current, 
        versionInfo.latest
      );

      return {
        hasUpdates,
        availableVersion: hasUpdates ? versionInfo.latest : undefined,
        breaking: compatibility.breaking,
        updateDescription: hasUpdates 
          ? `Update available: ${versionInfo.current} → ${versionInfo.latest}`
          : undefined
      };

    } catch (error) {
      console.error(`Error checking updates for ${moduleId}:`, error);
      return { hasUpdates: false, breaking: false };
    }
  }

  /**
   * Get rollback options for a module
   */
  async getRollbackOptions(moduleId: string): Promise<string[]> {
    try {
      const repositoryModules = await moduleRepository.getRepositoryModules();
      return repositoryModules
        .filter(entry => entry.moduleId === moduleId && entry.status === 'deployed')
        .map(entry => entry.version)
        .sort(this.compareVersions)
        .reverse(); // Most recent first

    } catch (error) {
      console.error(`Error getting rollback options for ${moduleId}:`, error);
      return [];
    }
  }

  /**
   * Create hot-swap backup
   */
  private async createHotSwapBackup(moduleId: string, tenantId: string): Promise<string | null> {
    try {
      // In a real implementation, this would create a backup of the current module state
      // For now, we'll return a mock backup ID
      const backupId = `backup-${moduleId}-${tenantId}-${Date.now()}`;
      console.log(`Created hot-swap backup: ${backupId}`);
      return backupId;
    } catch (error) {
      console.error(`Error creating backup for ${moduleId}:`, error);
      return null;
    }
  }

  /**
   * Rollback hot-swap using backup
   */
  private async rollbackHotSwap(moduleId: string, tenantId: string, backupId: string): Promise<void> {
    // In a real implementation, this would restore from the backup
    console.log(`Rolling back hot-swap using backup: ${backupId}`);
  }

  /**
   * Compare two semantic versions
   */
  private compareVersions(versionA: string, versionB: string): number {
    const parseVersion = (version: string) => {
      const parts = version.split('.').map(Number);
      return {
        major: parts[0] || 0,
        minor: parts[1] || 0,
        patch: parts[2] || 0
      };
    };

    const a = parseVersion(versionA);
    const b = parseVersion(versionB);

    if (a.major !== b.major) return a.major - b.major;
    if (a.minor !== b.minor) return a.minor - b.minor;
    return a.patch - b.patch;
  }
}

export const moduleVersionManager = ModuleVersionManager.getInstance();
