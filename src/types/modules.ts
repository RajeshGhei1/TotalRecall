
export interface ModuleManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  category: 'core' | 'business' | 'recruitment' | 'analytics' | 'ai' | 'integration' | 'communication' | 'custom';
  
  // Module metadata
  author: string;
  license: string;
  homepage?: string;
  repository?: string;
  
  // Dependencies and compatibility
  dependencies: string[];
  peerDependencies?: string[];
  minCoreVersion: string;
  maxCoreVersion?: string;
  
  // Module structure
  entryPoint: string;
  routes?: ModuleRoute[];
  components?: ModuleComponent[];
  services?: ModuleService[];
  hooks?: ModuleHook[];
  
  // Access control
  requiredPermissions: string[];
  subscriptionTiers: string[];
  
  // Resource requirements
  resourceLimits?: {
    memory?: number;
    cpu?: number;
    storage?: number;
  };
  
  // Module lifecycle
  loadOrder: number;
  autoLoad: boolean;
  canUnload: boolean;
  
  // Development settings
  developmentMode?: boolean;
  hotReload?: boolean;
  sandboxed?: boolean;
}

export interface ModuleRoute {
  path: string;
  component: string;
  exact?: boolean;
  guards?: string[];
  metadata?: Record<string, any>;
}

export interface ModuleComponent {
  name: string;
  path: string;
  exports: string[];
  props?: Record<string, any>;
}

export interface ModuleService {
  name: string;
  path: string;
  singleton?: boolean;
  dependencies?: string[];
}

export interface ModuleHook {
  name: string;
  path: string;
  dependencies?: string[];
}

export interface DevelopmentStageData {
  stage: string;
  progress: number;
  promoted_at?: string;
  promoted_from?: string;
}

export interface ModuleProgressData {
  overall_progress: number;
  code_completion: number;
  test_coverage: number;
  feature_completion: number;
  documentation_completion: number;
  quality_score: number;
}

export interface LoadedModule {
  manifest: ModuleManifest;
  instance: any;
  status: 'loading' | 'loaded' | 'error' | 'unloaded';
  error?: string;
  loadedAt: Date;
  dependencies: LoadedModule[];
  developmentStage?: DevelopmentStageData;
  progressData?: ModuleProgressData;
}

export interface ModuleContext {
  moduleId: string;
  tenantId: string;
  userId: string;
  permissions: string[];
  config: Record<string, any>;
}

export interface ModuleLoadOptions {
  force?: boolean;
  skipDependencies?: boolean;
  developmentMode?: boolean;
  sandboxed?: boolean;
}
