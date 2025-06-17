
import { supabase } from '@/integrations/supabase/client';

export interface ModuleRepositoryEntry {
  id: string;
  moduleId: string;
  version: string;
  status: 'pending' | 'approved' | 'deployed' | 'rejected';
  size: number;
  uploadedAt: Date;
  validationResult: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    compatibilityIssues: string[];
  };
  manifest: any;
  packagePath?: string;
  packageHash?: string;
}

export interface ModulePackage {
  id: string;
  packageHash: string;
  size: number;
  manifest: any;
  file?: File;
}

export interface DeploymentResult {
  success: boolean;
  error?: string;
  deploymentId?: string;
}

export interface ModuleValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  compatibilityIssues: string[];
}

export class ModuleRepository {
  private static instance: ModuleRepository;

  static getInstance(): ModuleRepository {
    if (!ModuleRepository.instance) {
      ModuleRepository.instance = new ModuleRepository();
    }
    return ModuleRepository.instance;
  }

  async getRepositoryModules(): Promise<ModuleRepositoryEntry[]> {
    try {
      const { data, error } = await supabase.rpc('get_module_registry_entries');
      
      if (error) {
        console.error('Error fetching module registry entries:', error);
        throw error;
      }

      return (data || []).map((entry: any) => ({
        id: entry.id,
        moduleId: entry.module_id,
        version: entry.version,
        status: entry.status,
        size: entry.package_size || 0,
        uploadedAt: new Date(entry.uploaded_at),
        validationResult: entry.validation_results,
        manifest: entry.manifest,
        packagePath: entry.package_path,
        packageHash: entry.package_hash
      }));
    } catch (error) {
      console.error('Error in getRepositoryModules:', error);
      return [];
    }
  }

  async uploadModule(modulePackage: ModulePackage, uploaderId: string): Promise<ModuleRepositoryEntry> {
    console.log(`Uploading module ${modulePackage.id} by ${uploaderId}`);
    
    try {
      // Validate manifest first
      const validationResult = await this.validateManifest(modulePackage.manifest);
      
      // Insert into module registry
      const { data: registryEntry, error: registryError } = await supabase
        .from('module_registry')
        .insert({
          module_id: modulePackage.id,
          version: modulePackage.manifest.version || '1.0.0',
          status: 'pending',
          package_hash: modulePackage.packageHash,
          package_size: modulePackage.size,
          manifest: modulePackage.manifest,
          validation_results: validationResult,
          uploaded_by: uploaderId
        })
        .select()
        .single();

      if (registryError) {
        throw registryError;
      }

      // If there's a file, handle file upload
      if (modulePackage.file) {
        await this.handleFileUpload(registryEntry.id, modulePackage.file);
      }

      return {
        id: registryEntry.id,
        moduleId: registryEntry.module_id,
        version: registryEntry.version,
        status: registryEntry.status,
        size: registryEntry.package_size || 0,
        uploadedAt: new Date(registryEntry.uploaded_at),
        validationResult: registryEntry.validation_results,
        manifest: registryEntry.manifest,
        packageHash: registryEntry.package_hash
      };
    } catch (error) {
      console.error('Error uploading module:', error);
      throw error;
    }
  }

  async validateManifest(manifest: any): Promise<ModuleValidationResult> {
    try {
      const { data, error } = await supabase.rpc('validate_module_manifest', {
        manifest_data: manifest
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error validating manifest:', error);
      return {
        isValid: false,
        errors: ['Failed to validate manifest'],
        warnings: [],
        compatibilityIssues: []
      };
    }
  }

  private async handleFileUpload(registryId: string, file: File): Promise<void> {
    try {
      // Record file upload in database
      const { error } = await supabase
        .from('module_package_uploads')
        .insert({
          registry_id: registryId,
          file_name: file.name,
          file_size: file.size,
          file_hash: await this.calculateFileHash(file),
          mime_type: file.type,
          upload_status: 'uploaded'
        });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error handling file upload:', error);
      throw error;
    }
  }

  private async calculateFileHash(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async approveModule(entryId: string, approverId: string): Promise<void> {
    console.log(`Approving module entry ${entryId} by ${approverId}`);
    
    try {
      const { error } = await supabase
        .from('module_registry')
        .update({
          status: 'approved',
          approved_by: approverId,
          approved_at: new Date().toISOString()
        })
        .eq('id', entryId);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error approving module:', error);
      throw error;
    }
  }

  async deployModule(entryId: string, options: { rollbackOnFailure?: boolean; notifyUsers?: boolean }): Promise<DeploymentResult> {
    console.log(`Deploying module entry ${entryId} with options:`, options);
    
    try {
      // Get module entry
      const { data: moduleEntry, error: fetchError } = await supabase
        .from('module_registry')
        .select('*')
        .eq('id', entryId)
        .single();

      if (fetchError || !moduleEntry) {
        throw new Error('Module entry not found');
      }

      // Update status to deployed
      const { error: updateError } = await supabase
        .from('module_registry')
        .update({
          status: 'deployed',
          deployed_at: new Date().toISOString()
        })
        .eq('id', entryId);

      if (updateError) {
        throw updateError;
      }

      // Record deployment history
      const { data: deploymentRecord, error: historyError } = await supabase
        .from('module_deployment_history')
        .insert({
          module_id: moduleEntry.module_id,
          version: moduleEntry.version,
          deployment_type: 'deploy',
          status: 'success',
          deployed_by: moduleEntry.uploaded_by,
          deployment_notes: 'Deployed via module development system'
        })
        .select()
        .single();

      if (historyError) {
        console.warn('Failed to record deployment history:', historyError);
      }

      return {
        success: true,
        deploymentId: deploymentRecord?.id
      };
    } catch (error) {
      console.error('Error deploying module:', error);
      
      // Record failed deployment
      try {
        await supabase
          .from('module_deployment_history')
          .insert({
            module_id: entryId,
            version: '1.0.0',
            deployment_type: 'deploy',
            status: 'failed',
            error_details: { error: error instanceof Error ? error.message : 'Unknown error' }
          });
      } catch (logError) {
        console.warn('Failed to log deployment error:', logError);
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Deployment failed'
      };
    }
  }

  async getRepositoryEntryByVersion(moduleId: string, version: string): Promise<ModuleRepositoryEntry | null> {
    try {
      const { data, error } = await supabase
        .from('module_registry')
        .select('*')
        .eq('module_id', moduleId)
        .eq('version', version)
        .single();

      if (error || !data) {
        return null;
      }

      return {
        id: data.id,
        moduleId: data.module_id,
        version: data.version,
        status: data.status,
        size: data.package_size || 0,
        uploadedAt: new Date(data.uploaded_at),
        validationResult: data.validation_results,
        manifest: data.manifest,
        packagePath: data.package_path,
        packageHash: data.package_hash
      };
    } catch (error) {
      console.error('Error fetching module by version:', error);
      return null;
    }
  }

  async getModuleDependencies(moduleId: string): Promise<Array<{
    dependencyModuleId: string;
    versionConstraint: string;
    dependencyType: string;
  }>> {
    try {
      const { data, error } = await supabase
        .from('module_dependencies')
        .select('*')
        .eq('module_id', moduleId);

      if (error) {
        throw error;
      }

      return (data || []).map(dep => ({
        dependencyModuleId: dep.dependency_module_id,
        versionConstraint: dep.version_constraint,
        dependencyType: dep.dependency_type
      }));
    } catch (error) {
      console.error('Error fetching module dependencies:', error);
      return [];
    }
  }

  async addModuleDependency(moduleId: string, dependencyModuleId: string, versionConstraint: string = '*', dependencyType: string = 'runtime'): Promise<void> {
    try {
      const { error } = await supabase
        .from('module_dependencies')
        .insert({
          module_id: moduleId,
          dependency_module_id: dependencyModuleId,
          version_constraint: versionConstraint,
          dependency_type: dependencyType
        });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error adding module dependency:', error);
      throw error;
    }
  }
}

export const moduleRepository = ModuleRepository.getInstance();
