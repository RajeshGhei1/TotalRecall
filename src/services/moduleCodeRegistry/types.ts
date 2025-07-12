
import { ModuleManifest } from '@/types/modules';

export interface ModuleComponent {
  id: string;
  name: string;
  component: React.ComponentType<Record<string, unknown>>;
  manifest: ModuleManifest;
  path: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface DiscoveryResult {
  registered: string[];
  failed: { moduleId: string; error: string }[];
}
