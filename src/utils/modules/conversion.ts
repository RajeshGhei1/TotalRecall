
// Utility functions for converting between module types

import { Module, ModuleDevelopmentStage, SystemModuleCompatible } from './types';

/**
 * Convert SystemModule to Module format
 */
export const convertSystemModuleToModule = (systemModule: SystemModuleCompatible): Module => {
  return {
    id: systemModule.id,
    name: systemModule.name,
    module_id: systemModule.module_id || systemModule.name,
    description: systemModule.description,
    category: systemModule.category,
    maturity_status: systemModule.maturity_status,
    development_stage: systemModule.development_stage,
    overall_progress: systemModule.overall_progress,
    version: systemModule.version,
    dependencies: systemModule.dependencies,
    is_active: systemModule.is_active
  };
};

/**
 * Convert array of SystemModules to Module array
 */
export const convertSystemModulesToModules = (systemModules: SystemModuleCompatible[]): Module[] => {
  return systemModules.map(convertSystemModuleToModule);
};

/**
 * Parse development stage from various formats
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
