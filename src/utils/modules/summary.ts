
// Module status summary utilities

import { Module, ModuleStatusSummary } from './types';
import { getDevelopmentProgress, getDevelopmentStage, getModuleRequirements } from './progress';
import { isFunctionalModule, isProductionReadyModule, isBetaReadyModule } from './classification';
import { getDisplayName, normalizeModuleName } from '../moduleNameMapping';
import { PROGRESS_THRESHOLDS } from './config';

/**
 * Get module status summary with enhanced logic
 */
export const getModuleStatusSummary = (module: Module): ModuleStatusSummary => {
  const progress = getDevelopmentProgress(module);
  const stage = getDevelopmentStage(module);
  const requirements = getModuleRequirements(module);
  const moduleName = module.name || module.module_id || '';
  
  return {
    progress,
    stage,
    requirements,
    isProduction: progress >= PROGRESS_THRESHOLDS.production,
    isBeta: progress >= PROGRESS_THRESHOLDS.beta && progress < PROGRESS_THRESHOLDS.production,
    isAlpha: progress >= PROGRESS_THRESHOLDS.alpha && progress < PROGRESS_THRESHOLDS.beta,
    isPlanning: progress < PROGRESS_THRESHOLDS.alpha,
    isFunctional: isFunctionalModule(moduleName),
    isProductionReady: isProductionReadyModule(moduleName),
    isBetaReady: isBetaReadyModule(moduleName),
    displayName: getDisplayName(moduleName),
    technicalName: normalizeModuleName(moduleName)
  };
};
