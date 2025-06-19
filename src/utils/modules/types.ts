
// Type definitions for module utilities

export interface Module {
  id?: string;
  name: string;
  module_id?: string;
  description?: string;
  category?: string;
  maturity_status?: ModuleMaturityStatus;
  development_stage?: ModuleDevelopmentStage | string;
  overall_progress?: number;
  version?: string;
  dependencies?: string[];
  is_active?: boolean;
}

export type ModuleMaturityStatus = 'planning' | 'alpha' | 'beta' | 'production';

export interface ModuleDevelopmentStage {
  stage: string;
  progress: number;
  milestones?: string[];
  requirements?: string[];
}

export interface ModuleColors {
  background: string;
  border: string;
  text: string;
  leftBorder: string;
}

export interface ModuleStatusSummary {
  progress: number;
  stage: string;
  requirements: string[];
  isProduction: boolean;
  isBeta: boolean;
  isAlpha: boolean;
  isPlanning: boolean;
  isFunctional: boolean;
  isProductionReady: boolean;
  isBetaReady: boolean;
  displayName: string;
  technicalName: string;
}

export interface MaturityStatusVariant {
  variant: 'default' | 'secondary' | 'outline';
  className: string;
}

export interface ModuleProgressThresholds {
  production: number;
  beta: number;
  alpha: number;
  planning: number;
}
