
// Legacy export file for backward compatibility
// This file maintains the existing API while using the new modular structure

// Import everything from the new modular structure
export * from './modules';

// Re-export specific functions that were previously in this file
export {
  isFunctionalModule,
  isProductionReadyModule,
  isBetaReadyModule,
  isProductionModule,
  isDevelopmentModule,
  getFunctionalModuleCount,
  getProductionModuleCount,
  getDevelopmentModuleCount,
  getFunctionalModuleColors,
  getProductionReadyColors,
  getMaturityStatusVariant,
  getDevelopmentProgress,
  getDevelopmentStage,
  getModuleRequirements,
  getModuleStatusSummary,
  convertSystemModuleToModule,
  convertSystemModulesToModules,
  parseDevelopmentStage
} from './modules';
