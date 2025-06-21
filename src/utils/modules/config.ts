
// Configuration constants for module utilities

import { ModuleProgressThresholds } from './types';

// Progress thresholds for different stages
export const PROGRESS_THRESHOLDS: ModuleProgressThresholds = {
  production: 90,
  beta: 80,
  alpha: 40,
  planning: 0
};

// List of functional modules that should be highlighted in green (using technical names)
export const FUNCTIONAL_MODULES = [
  'ats_core',
  'user_management',
  'talent_database',
  'core_dashboard',
  'smart_talent_analytics',
  'document_management',
  'ai_orchestration',
  'custom_field_management'
] as const;

// Production-ready modules with 90%+ completion (using technical names)
export const PRODUCTION_READY_MODULES = [
  // Currently no modules are production-ready
] as const;

// Beta-ready modules with 80%+ completion (using technical names)
export const BETA_READY_MODULES = [
  'ats_core',
  'user_management', 
  'talent_database',
  'core_dashboard',
  'smart_talent_analytics',
  'document_management',
  'ai_orchestration',
  'custom_field_management'
] as const;
