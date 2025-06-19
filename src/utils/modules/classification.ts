
// Module classification utilities

import { normalizeModuleName } from '../moduleNameMapping';
import { FUNCTIONAL_MODULES, PRODUCTION_READY_MODULES, BETA_READY_MODULES, PROGRESS_THRESHOLDS } from './config';
import { Module } from './types';

/**
 * Check if a module is functional (fully implemented)
 */
export const isFunctionalModule = (moduleName: string): boolean => {
  const normalizedName = normalizeModuleName(moduleName);
  return FUNCTIONAL_MODULES.includes(normalizedName as any);
};

/**
 * Check if a module is production ready (90%+ progress)
 */
export const isProductionReadyModule = (moduleName: string): boolean => {
  const normalizedName = normalizeModuleName(moduleName);
  return PRODUCTION_READY_MODULES.includes(normalizedName as any);
};

/**
 * Check if a module is beta ready (80%+ progress)
 */
export const isBetaReadyModule = (moduleName: string): boolean => {
  const normalizedName = normalizeModuleName(moduleName);
  return BETA_READY_MODULES.includes(normalizedName as any);
};

/**
 * Check if a module is in production status
 */
export const isProductionModule = (module: Module): boolean => {
  const moduleName = module.name || module.module_id || '';
  return module.maturity_status === 'production' || 
         (module.overall_progress !== undefined && module.overall_progress >= PROGRESS_THRESHOLDS.production) ||
         isProductionReadyModule(moduleName);
};

/**
 * Check if a module is in development
 */
export const isDevelopmentModule = (module: Module): boolean => {
  if (module.overall_progress !== undefined) {
    return module.overall_progress < PROGRESS_THRESHOLDS.production;
  }
  return ['planning', 'alpha', 'beta'].includes(module.maturity_status || 'planning');
};

/**
 * Get count of functional modules from a list of modules
 */
export const getFunctionalModuleCount = (modules: Module[]): number => {
  return modules?.filter(module => isFunctionalModule(module.name || module.module_id || '')).length || 0;
};

/**
 * Get count of production modules from a list of modules
 */
export const getProductionModuleCount = (modules: Module[]): number => {
  return modules?.filter(module => 
    isProductionModule(module) || 
    (module.overall_progress !== undefined && module.overall_progress >= PROGRESS_THRESHOLDS.production)
  ).length || 0;
};

/**
 * Get count of development modules from a list of modules
 */
export const getDevelopmentModuleCount = (modules: Module[]): number => {
  return modules?.filter(module => isDevelopmentModule(module)).length || 0;
};
