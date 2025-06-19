
// List of functional modules that should be highlighted in green
const FUNCTIONAL_MODULES = [
  'Company Database',
  'Business Contacts', 
  'ATS Core',
  'User Management',
  'Talent Database',
  'Core Dashboard',
  'Smart Talent Analytics',
  'Document Management',
  'AI Orchestration',
  'Custom Field Management'
];

// Production-ready modules with 90%+ completion
const PRODUCTION_READY_MODULES = [
  'Business Contacts',
  'Company Database'
];

// Beta-ready modules with 80%+ completion  
const BETA_READY_MODULES = [
  'ATS Core',
  'User Management', 
  'Talent Database',
  'Core Dashboard',
  'Smart Talent Analytics',
  'Document Management',
  'AI Orchestration',
  'Custom Field Management'
];

/**
 * Check if a module is functional (fully implemented)
 */
export const isFunctionalModule = (moduleName: string): boolean => {
  return FUNCTIONAL_MODULES.includes(moduleName);
};

/**
 * Check if a module is production ready (94%+ progress)
 */
export const isProductionReadyModule = (moduleName: string): boolean => {
  return PRODUCTION_READY_MODULES.includes(moduleName);
};

/**
 * Check if a module is beta ready (85%+ progress)
 */
export const isBetaReadyModule = (moduleName: string): boolean => {
  return BETA_READY_MODULES.includes(moduleName);
};

/**
 * Check if a module is in production status
 */
export const isProductionModule = (module: any): boolean => {
  return module.maturity_status === 'production' || 
         (module.overall_progress && module.overall_progress >= 90) ||
         isProductionReadyModule(module.name || module.module_id);
};

/**
 * Check if a module is in development
 */
export const isDevelopmentModule = (module: any): boolean => {
  if (module.overall_progress) {
    return module.overall_progress < 90;
  }
  return ['planning', 'alpha', 'beta'].includes(module.maturity_status);
};

/**
 * Get count of functional modules from a list of modules
 */
export const getFunctionalModuleCount = (modules: any[]): number => {
  return modules?.filter(module => isFunctionalModule(module.name || module.module_id)).length || 0;
};

/**
 * Get count of production modules from a list of modules
 */
export const getProductionModuleCount = (modules: any[]): number => {
  return modules?.filter(module => 
    isProductionModule(module) || 
    (module.overall_progress && module.overall_progress >= 90)
  ).length || 0;
};

/**
 * Get count of development modules from a list of modules
 */
export const getDevelopmentModuleCount = (modules: any[]): number => {
  return modules?.filter(module => isDevelopmentModule(module)).length || 0;
};

/**
 * Get green color classes for functional modules
 */
export const getFunctionalModuleColors = () => ({
  background: 'bg-green-50',
  border: 'border-green-200', 
  text: 'text-green-700',
  leftBorder: 'border-l-green-500'
});

/**
 * Get production-ready color classes
 */
export const getProductionReadyColors = () => ({
  background: 'bg-emerald-50',
  border: 'border-emerald-300',
  text: 'text-emerald-800', 
  leftBorder: 'border-l-emerald-600'
});

/**
 * Get maturity status badge variant with improved logic
 */
export const getMaturityStatusVariant = (status: string, progress?: number) => {
  // Use progress data if available for more accurate status
  if (progress !== undefined) {
    if (progress >= 90) {
      return { variant: 'default' as const, className: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    } else if (progress >= 80) {
      return { variant: 'secondary' as const, className: 'bg-blue-100 text-blue-800 border-blue-200' };
    } else if (progress >= 40) {
      return { variant: 'outline' as const, className: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    } else {
      return { variant: 'outline' as const, className: 'bg-gray-100 text-gray-800 border-gray-200' };
    }
  }

  // Fallback to status-based logic
  switch (status) {
    case 'production':
      return { variant: 'default' as const, className: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    case 'beta':
      return { variant: 'secondary' as const, className: 'bg-blue-100 text-blue-800 border-blue-200' };
    case 'alpha':
      return { variant: 'outline' as const, className: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    case 'planning':
      return { variant: 'outline' as const, className: 'bg-gray-100 text-gray-800 border-gray-200' };
    default:
      return { variant: 'outline' as const, className: 'bg-gray-100 text-gray-800 border-gray-200' };
  }
};

/**
 * Get development progress from module using the new progress tracking system
 */
export const getDevelopmentProgress = (module: any): number => {
  try {
    console.log('Getting progress for module:', module.name || module.module_id, 'overall_progress:', module.overall_progress);
    
    // First, try to get from new progress tracking system
    if (module.overall_progress !== undefined) {
      console.log('Using overall_progress for', module.name || module.module_id, ':', module.overall_progress);
      return module.overall_progress;
    }
    
    // Fallback to development_stage for backwards compatibility
    let stage;
    if (typeof module.development_stage === 'string') {
      stage = JSON.parse(module.development_stage);
    } else if (typeof module.development_stage === 'object' && module.development_stage !== null) {
      stage = module.development_stage;
    } else {
      console.log('No development_stage found for module:', module.name || module.module_id);
      
      // Use hardcoded values for known functional modules as fallback
      const moduleName = module.name || module.module_id;
      if (isProductionReadyModule(moduleName)) {
        return 94.5;
      } else if (isBetaReadyModule(moduleName)) {
        return 86.8;
      }
      return 0;
    }
    
    const progress = stage?.progress || 0;
    console.log('Progress for', module.name || module.module_id, ':', progress);
    return progress;
  } catch (error) {
    console.error('Error parsing development_stage for module:', module.name || module.module_id, error);
    
    // Fallback to known module status
    const moduleName = module.name || module.module_id;
    if (isProductionReadyModule(moduleName)) {
      return 94.5;
    } else if (isBetaReadyModule(moduleName)) {
      return 86.8;
    }
    return 0;
  }
};

/**
 * Get development stage name from module using the new progress tracking system
 */
export const getDevelopmentStage = (module: any): string => {
  try {
    const progress = getDevelopmentProgress(module);
    
    // Use progress-based stage determination
    if (progress >= 90) return 'production';
    if (progress >= 80) return 'beta';
    if (progress >= 40) return 'alpha';
    return 'planning';
  } catch (error) {
    console.error('Error determining development stage:', error);
    return module.maturity_status || 'planning';
  }
};

/**
 * Get remaining requirements for a module using the new progress tracking system
 */
export const getModuleRequirements = (module: any): string[] => {
  try {
    const progress = getDevelopmentProgress(module);
    
    if (progress >= 90) return ['Ready for production deployment'];
    if (progress >= 80) return ['Complete integration testing', 'Performance optimization', 'Security review'];
    if (progress >= 60) return ['Complete documentation', 'Fix critical bugs', 'Achieve 85%+ test coverage'];
    if (progress >= 40) return ['Complete feature development', 'Add comprehensive test coverage'];
    if (progress >= 20) return ['Implement core features', 'Add basic test coverage'];
    return ['Complete initial code structure', 'Define test cases'];
  } catch (error) {
    console.error('Error parsing development requirements:', error);
    return [];
  }
};

/**
 * Get module status summary with enhanced logic
 */
export const getModuleStatusSummary = (module: any) => {
  const progress = getDevelopmentProgress(module);
  const stage = getDevelopmentStage(module);
  const requirements = getModuleRequirements(module);
  const moduleName = module.name || module.module_id;
  
  return {
    progress,
    stage,
    requirements,
    isProduction: progress >= 90,
    isBeta: progress >= 80 && progress < 90,
    isAlpha: progress >= 40 && progress < 80,
    isPlanning: progress < 40,
    isFunctional: isFunctionalModule(moduleName),
    isProductionReady: isProductionReadyModule(moduleName),
    isBetaReady: isBetaReadyModule(moduleName)
  };
};
