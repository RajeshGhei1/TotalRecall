
import { ModulePackage, PackageValidationResult } from './modulePackager';
import { ModuleManifest } from '@/types/modules';
import { supabase } from '@/integrations/supabase/client';

export interface ModuleRepositoryEntry {
  id: string;
  moduleId: string;
  version: string;
  packageHash: string;
  size: number;
  status: 'pending' | 'approved' | 'rejected' | 'deployed';
  uploadedBy: string;
  uploadedAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  deployedAt?: Date;
  validationResult: PackageValidationResult;
  downloadUrl?: string;
  rollbackVersion?: string;
}

export interface ModuleDeploymentOptions {
  force?: boolean;
  skipValidation?: boolean;
  rollbackOnFailure?: boolean;
  notifyUsers?: boolean;
}

export class ModuleRepository {
  private static instance: ModuleRepository;

  static getInstance(): ModuleRepository {
    if (!ModuleRepository.instance) {
      ModuleRepository.instance = new ModuleRepository();
    }
    return ModuleRepository.instance;
  }

  /**
   * Upload a module package to the repository
   */
  async uploadModule(modulePackage: ModulePackage, uploadedBy: string): Promise<string> {
    console.log(`Uploading module ${modulePackage.id} to repository`);

    try {
      // Create repository entry
      const entry: ModuleRepositoryEntry = {
        id: `${modulePackage.manifest.id}-${modulePackage.manifest.version}-${Date.now()}`,
        moduleId: modulePackage.manifest.id,
        version: modulePackage.manifest.version,
        packageHash: modulePackage.packageHash,
        size: modulePackage.size,
        status: 'pending',
        uploadedBy,
        uploadedAt: new Date(),
        validationResult: {
          isValid: true,
          errors: [],
          warnings: [],
          compatibilityIssues: []
        }
      };

      // Store package data (in real implementation, this would go to file storage)
      await this.storePackageData(entry.id, modulePackage);

      // Store repository entry in database
      const { data, error } = await supabase
        .from('module_repository')
        .insert({
          id: entry.id,
          module_id: entry.moduleId,
          version: entry.version,
          package_hash: entry.packageHash,
          size: entry.size,
          status: entry.status,
          uploaded_by: entry.uploadedBy,
          uploaded_at: entry.uploadedAt.toISOString(),
          validation_result: entry.validationResult
        })
        .select()
        .single();

      if (error) throw error;

      console.log(`Module ${modulePackage.id} uploaded successfully`);
      return entry.id;

    } catch (error) {
      console.error(`Error uploading module ${modulePackage.id}:`, error);
      throw error;
    }
  }

  /**
   * Approve a module for deployment
   */
  async approveModule(entryId: string, approvedBy: string): Promise<void> {
    console.log(`Approving module ${entryId}`);

    try {
      const { error } = await supabase
        .from('module_repository')
        .update({
          status: 'approved',
          approved_by: approvedBy,
          approved_at: new Date().toISOString()
        })
        .eq('id', entryId);

      if (error) throw error;

      console.log(`Module ${entryId} approved successfully`);
    } catch (error) {
      console.error(`Error approving module ${entryId}:`, error);
      throw error;
    }
  }

  /**
   * Deploy a module to production
   */
  async deployModule(
    entryId: string, 
    options: ModuleDeploymentOptions = {}
  ): Promise<{ success: boolean; rollbackId?: string }> {
    console.log(`Deploying module ${entryId}`);

    try {
      // Get repository entry
      const entry = await this.getRepositoryEntry(entryId);
      if (!entry) {
        throw new Error(`Repository entry not found: ${entryId}`);
      }

      // Check approval status
      if (entry.status !== 'approved' && !options.force) {
        throw new Error('Module must be approved before deployment');
      }

      // Get package data
      const modulePackage = await this.getPackageData(entryId);
      if (!modulePackage) {
        throw new Error(`Package data not found: ${entryId}`);
      }

      // Create rollback point
      const rollbackId = options.rollbackOnFailure 
        ? await this.createRollbackPoint(entry.moduleId)
        : undefined;

      try {
        // Deploy the module
        await this.performDeployment(modulePackage, options);

        // Update repository entry
        await supabase
          .from('module_repository')
          .update({
            status: 'deployed',
            deployed_at: new Date().toISOString(),
            rollback_version: rollbackId
          })
          .eq('id', entryId);

        // Update module registry
        await this.updateModuleRegistry(modulePackage.manifest);

        console.log(`Module ${entryId} deployed successfully`);
        return { success: true, rollbackId };

      } catch (deployError) {
        console.error(`Deployment failed for ${entryId}:`, deployError);

        // Rollback if enabled
        if (options.rollbackOnFailure && rollbackId) {
          await this.rollbackModule(entry.moduleId, rollbackId);
        }

        throw deployError;
      }

    } catch (error) {
      console.error(`Error deploying module ${entryId}:`, error);
      return { success: false };
    }
  }

  /**
   * Rollback a module to a previous version
   */
  async rollbackModule(moduleId: string, rollbackVersion: string): Promise<void> {
    console.log(`Rolling back module ${moduleId} to version ${rollbackVersion}`);

    try {
      // Get rollback package
      const rollbackEntry = await this.getRepositoryEntryByVersion(moduleId, rollbackVersion);
      if (!rollbackEntry) {
        throw new Error(`Rollback version not found: ${moduleId}@${rollbackVersion}`);
      }

      const rollbackPackage = await this.getPackageData(rollbackEntry.id);
      if (!rollbackPackage) {
        throw new Error(`Rollback package data not found`);
      }

      // Perform rollback deployment
      await this.performDeployment(rollbackPackage, { force: true });

      // Update registry
      await this.updateModuleRegistry(rollbackPackage.manifest);

      console.log(`Module ${moduleId} rolled back successfully`);
    } catch (error) {
      console.error(`Error rolling back module ${moduleId}:`, error);
      throw error;
    }
  }

  /**
   * Get all modules in repository
   */
  async getRepositoryModules(): Promise<ModuleRepositoryEntry[]> {
    try {
      const { data, error } = await supabase
        .from('module_repository')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) throw error;

      return data.map(item => this.convertToRepositoryEntry(item));
    } catch (error) {
      console.error('Error fetching repository modules:', error);
      return [];
    }
  }

  /**
   * Get repository entry by ID
   */
  async getRepositoryEntry(entryId: string): Promise<ModuleRepositoryEntry | null> {
    try {
      const { data, error } = await supabase
        .from('module_repository')
        .select('*')
        .eq('id', entryId)
        .single();

      if (error) throw error;

      return this.convertToRepositoryEntry(data);
    } catch (error) {
      console.error(`Error fetching repository entry ${entryId}:`, error);
      return null;
    }
  }

  /**
   * Get repository entry by module and version
   */
  async getRepositoryEntryByVersion(moduleId: string, version: string): Promise<ModuleRepositoryEntry | null> {
    try {
      const { data, error } = await supabase
        .from('module_repository')
        .select('*')
        .eq('module_id', moduleId)
        .eq('version', version)
        .eq('status', 'deployed')
        .order('deployed_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;

      return this.convertToRepositoryEntry(data);
    } catch (error) {
      console.error(`Error fetching repository entry ${moduleId}@${version}:`, error);
      return null;
    }
  }

  /**
   * Store package data (placeholder - would use actual file storage)
   */
  private async storePackageData(entryId: string, modulePackage: ModulePackage): Promise<void> {
    // In a real implementation, this would store the package in cloud storage
    // For now, we'll use a mock storage
    console.log(`Storing package data for ${entryId} (${modulePackage.size} bytes)`);
  }

  /**
   * Get package data (placeholder - would retrieve from file storage)
   */
  private async getPackageData(entryId: string): Promise<ModulePackage | null> {
    // In a real implementation, this would retrieve the package from cloud storage
    console.log(`Retrieving package data for ${entryId}`);
    return null; // Mock implementation
  }

  /**
   * Perform actual module deployment
   */
  private async performDeployment(modulePackage: ModulePackage, options: ModuleDeploymentOptions): Promise<void> {
    console.log(`Performing deployment for ${modulePackage.id}`);

    // In a real implementation, this would:
    // 1. Extract and deploy module assets
    // 2. Update runtime module registry
    // 3. Restart/reload affected services
    // 4. Run deployment verification tests
    
    // For now, simulate deployment
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  /**
   * Create rollback point
   */
  private async createRollbackPoint(moduleId: string): Promise<string> {
    // Get current deployed version
    const { data, error } = await supabase
      .from('module_repository')
      .select('version')
      .eq('module_id', moduleId)
      .eq('status', 'deployed')
      .order('deployed_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return '1.0.0'; // Default version
    }

    return data.version;
  }

  /**
   * Update module registry after deployment
   */
  private async updateModuleRegistry(manifest: ModuleManifest): Promise<void> {
    const { error } = await supabase
      .from('system_modules')
      .upsert({
        id: manifest.id,
        name: manifest.name,
        description: manifest.description,
        category: manifest.category,
        version: manifest.version,
        is_active: true,
        dependencies: manifest.dependencies,
        required_permissions: manifest.requiredPermissions
      });

    if (error) {
      console.error('Error updating module registry:', error);
      throw error;
    }
  }

  /**
   * Convert database record to repository entry
   */
  private convertToRepositoryEntry(data: any): ModuleRepositoryEntry {
    return {
      id: data.id,
      moduleId: data.module_id,
      version: data.version,
      packageHash: data.package_hash,
      size: data.size,
      status: data.status,
      uploadedBy: data.uploaded_by,
      uploadedAt: new Date(data.uploaded_at),
      approvedBy: data.approved_by,
      approvedAt: data.approved_at ? new Date(data.approved_at) : undefined,
      deployedAt: data.deployed_at ? new Date(data.deployed_at) : undefined,
      validationResult: data.validation_result || {
        isValid: true,
        errors: [],
        warnings: [],
        compatibilityIssues: []
      },
      downloadUrl: data.download_url,
      rollbackVersion: data.rollback_version
    };
  }
}

export const moduleRepository = ModuleRepository.getInstance();
