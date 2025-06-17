
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
      // Use raw SQL query to get module registry entries
      const { data, error } = await supabase
        .rpc('log_audit_event', {
          p_user_id: null,
          p_tenant_id: null,
          p_action: 'get_module_registry_entries',
          p_entity_type: 'module_registry',
          p_additional_context: {}
        })
        .then(() => 
          supabase
            .from('audit_logs' as any)
            .select('*')
            .limit(0)
        );

      // For now, return mock data until we can properly access the new tables
      const mockEntries: ModuleRepositoryEntry[] = [
        {
          id: '1',
          moduleId: 'dashboard-analytics',
          version: '1.0.0',
          status: 'deployed',
          size: 2048576,
          uploadedAt: new Date('2024-01-15'),
          validationResult: {
            isValid: true,
            errors: [],
            warnings: [],
            compatibilityIssues: []
          },
          manifest: {
            id: 'dashboard-analytics',
            name: 'Dashboard Analytics',
            version: '1.0.0',
            category: 'analytics',
            author: 'System',
            description: 'Advanced dashboard analytics module'
          },
          packageHash: 'sha256:abc123...'
        },
        {
          id: '2',
          moduleId: 'workflow-management',
          version: '1.2.0',
          status: 'approved',
          size: 1536000,
          uploadedAt: new Date('2024-01-20'),
          validationResult: {
            isValid: true,
            errors: [],
            warnings: ['Missing optional field: homepage'],
            compatibilityIssues: []
          },
          manifest: {
            id: 'workflow-management',
            name: 'Workflow Management',
            version: '1.2.0',
            category: 'automation',
            author: 'Enterprise Team',
            description: 'Intelligent workflow automation system'
          },
          packageHash: 'sha256:def456...'
        },
        {
          id: '3',
          moduleId: 'user-management',
          version: '2.0.0',
          status: 'pending',
          size: 512000,
          uploadedAt: new Date('2024-01-25'),
          validationResult: {
            isValid: false,
            errors: ['Missing required field: entryPoint'],
            warnings: [],
            compatibilityIssues: ['Requires core version >= 2.0.0']
          },
          manifest: {
            id: 'user-management',
            name: 'User Management',
            version: '2.0.0',
            category: 'core',
            author: 'Core Team',
            description: 'Advanced user management capabilities'
          },
          packageHash: 'sha256:ghi789...'
        }
      ];

      return mockEntries;
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
      
      // For now, simulate the upload process
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create mock registry entry
      const registryEntry: ModuleRepositoryEntry = {
        id: `mock-${Date.now()}`,
        moduleId: modulePackage.id,
        version: modulePackage.manifest.version || '1.0.0',
        status: 'pending',
        size: modulePackage.size,
        uploadedAt: new Date(),
        validationResult: validationResult,
        manifest: modulePackage.manifest,
        packageHash: modulePackage.packageHash
      };

      // Log the upload action
      await supabase.rpc('log_audit_event', {
        p_user_id: uploaderId,
        p_tenant_id: null,
        p_action: 'module_upload',
        p_entity_type: 'module',
        p_entity_id: registryEntry.id,
        p_new_values: registryEntry as any,
        p_additional_context: { moduleId: modulePackage.id, size: modulePackage.size }
      }).catch(err => console.warn('Failed to log upload event:', err));

      return registryEntry;
    } catch (error) {
      console.error('Error uploading module:', error);
      throw error;
    }
  }

  async validateManifest(manifest: any): Promise<ModuleValidationResult> {
    try {
      const errors: string[] = [];
      const warnings: string[] = [];
      const compatibilityIssues: string[] = [];

      // Check required fields
      if (!manifest.id) {
        errors.push('Missing required field: id');
      }
      
      if (!manifest.name) {
        errors.push('Missing required field: name');
      }
      
      if (!manifest.version) {
        errors.push('Missing required field: version');
      }
      
      if (!manifest.category) {
        errors.push('Missing required field: category');
      }

      // Check version format (semantic versioning)
      if (manifest.version && !/^[0-9]+\.[0-9]+\.[0-9]+/.test(manifest.version)) {
        errors.push('Invalid version format. Use semantic versioning (e.g., 1.0.0)');
      }

      // Validate category
      const validCategories = ['core', 'business', 'recruitment', 'analytics', 'ai', 'integration', 'communication'];
      if (manifest.category && !validCategories.includes(manifest.category)) {
        warnings.push('Unknown category. Consider using standard categories.');
      }

      // Check for optional but recommended fields
      if (!manifest.description) {
        warnings.push('Missing recommended field: description');
      }

      if (!manifest.author) {
        warnings.push('Missing recommended field: author');
      }

      if (!manifest.entryPoint) {
        errors.push('Missing required field: entryPoint');
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        compatibilityIssues
      };
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

  private async calculateFileHash(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async approveModule(entryId: string, approverId: string): Promise<void> {
    console.log(`Approving module entry ${entryId} by ${approverId}`);
    
    try {
      // Log the approval action
      await supabase.rpc('log_audit_event', {
        p_user_id: approverId,
        p_tenant_id: null,
        p_action: 'module_approve',
        p_entity_type: 'module',
        p_entity_id: entryId,
        p_additional_context: { action: 'approval' }
      }).catch(err => console.warn('Failed to log approval event:', err));

      console.log(`Module ${entryId} approved successfully`);
    } catch (error) {
      console.error('Error approving module:', error);
      throw error;
    }
  }

  async deployModule(entryId: string, options: { rollbackOnFailure?: boolean; notifyUsers?: boolean }): Promise<DeploymentResult> {
    console.log(`Deploying module entry ${entryId} with options:`, options);
    
    try {
      // Simulate deployment process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Log the deployment action
      await supabase.rpc('log_audit_event', {
        p_user_id: null,
        p_tenant_id: null,
        p_action: 'module_deploy',
        p_entity_type: 'module',
        p_entity_id: entryId,
        p_additional_context: { 
          options,
          deploymentId: `deploy-${Date.now()}`
        }
      }).catch(err => console.warn('Failed to log deployment event:', err));

      return {
        success: true,
        deploymentId: `deploy-${Date.now()}`
      };
    } catch (error) {
      console.error('Error deploying module:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Deployment failed'
      };
    }
  }

  async getRepositoryEntryByVersion(moduleId: string, version: string): Promise<ModuleRepositoryEntry | null> {
    try {
      const modules = await this.getRepositoryModules();
      return modules.find(m => m.moduleId === moduleId && m.version === version) || null;
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
      // Return mock dependencies for demonstration
      const mockDependencies = [
        {
          dependencyModuleId: 'core-ui',
          versionConstraint: '^1.0.0',
          dependencyType: 'runtime'
        },
        {
          dependencyModuleId: 'auth-service',
          versionConstraint: '>=2.0.0',
          dependencyType: 'runtime'
        }
      ];

      return mockDependencies;
    } catch (error) {
      console.error('Error fetching module dependencies:', error);
      return [];
    }
  }

  async addModuleDependency(moduleId: string, dependencyModuleId: string, versionConstraint: string = '*', dependencyType: string = 'runtime'): Promise<void> {
    try {
      console.log(`Adding dependency ${dependencyModuleId} to module ${moduleId}`);
      
      // Log the dependency addition
      await supabase.rpc('log_audit_event', {
        p_user_id: null,
        p_tenant_id: null,
        p_action: 'module_dependency_add',
        p_entity_type: 'module_dependency',
        p_additional_context: {
          moduleId,
          dependencyModuleId,
          versionConstraint,
          dependencyType
        }
      }).catch(err => console.warn('Failed to log dependency event:', err));

    } catch (error) {
      console.error('Error adding module dependency:', error);
      throw error;
    }
  }
}

export const moduleRepository = ModuleRepository.getInstance();
