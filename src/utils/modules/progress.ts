
// Module progress calculation utilities

import { Module, ModuleDevelopmentStage } from './types';
import { isProductionReadyModule, isBetaReadyModule } from './classification';
import { PROGRESS_THRESHOLDS } from './config';

/**
 * Parse development stage from module data
 */
export const parseDevelopmentStage = (developmentStage: any): ModuleDevelopmentStage | null => {
  try {
    if (typeof developmentStage === 'string') {
      return JSON.parse(developmentStage);
    } else if (typeof developmentStage === 'object' && developmentStage !== null) {
      // Ensure it has the required properties
      if (developmentStage.stage && typeof developmentStage.progress === 'number') {
        return developmentStage as ModuleDevelopmentStage;
      }
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Get development progress from module using the new progress tracking system
 */
export const getDevelopmentProgress = (module: Module): number => {
  const moduleName = module.name || module.module_id || '';
  
  // First, try to get from new progress tracking system
  if (module.overall_progress !== undefined) {
    return module.overall_progress;
  }
  
  // Fallback to development_stage for backwards compatibility
  const stage = parseDevelopmentStage(module.development_stage);
  if (stage?.progress !== undefined) {
    return stage.progress;
  }
  
  // Use hardcoded values for known functional modules as fallback
  if (isProductionReadyModule(moduleName)) {
    return 94.5;
  } else if (isBetaReadyModule(moduleName)) {
    return 86.8;
  }
  
  return 0;
};

/**
 * Get development stage name from module using the new progress tracking system
 */
export const getDevelopmentStage = (module: Module): string => {
  const progress = getDevelopmentProgress(module);
  
  // Use progress-based stage determination
  if (progress >= PROGRESS_THRESHOLDS.production) return 'production';
  if (progress >= PROGRESS_THRESHOLDS.beta) return 'beta';
  if (progress >= PROGRESS_THRESHOLDS.alpha) return 'alpha';
  return 'planning';
};

/**
 * Get remaining requirements for a module using the new progress tracking system
 */
export const getModuleRequirements = (module: Module): string[] => {
  const progress = getDevelopmentProgress(module);
  
  if (progress >= PROGRESS_THRESHOLDS.production) return ['Ready for production deployment'];
  if (progress >= PROGRESS_THRESHOLDS.beta) return ['Complete integration testing', 'Performance optimization', 'Security review'];
  if (progress >= 60) return ['Complete documentation', 'Fix critical bugs', 'Achieve 85%+ test coverage'];
  if (progress >= PROGRESS_THRESHOLDS.alpha) return ['Complete feature development', 'Add comprehensive test coverage'];
  if (progress >= 20) return ['Implement core features', 'Add basic test coverage'];
  return ['Complete initial code structure', 'Define test cases'];
};
