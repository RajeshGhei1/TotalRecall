
import { ModuleManifest, LoadedModule } from '@/types/modules';

export interface BuiltInModuleConfig {
  id: string;
  name: string;
  path: string;
  category: 'core' | 'business' | 'recruitment' | 'analytics' | 'ai' | 'integration' | 'communication' | 'custom';
  version: string;
  description: string;
  author: string;
  dependencies: string[];
  loadOrder: number;
}

export interface ModuleFileInfo {
  path: string;
  exists: boolean;
}

export interface DiscoveryResult {
  loaded: string[];
  failed: { moduleId: string; error: string }[];
}
