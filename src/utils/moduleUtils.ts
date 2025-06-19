
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

/**
 * Check if a module is functional (fully implemented)
 */
export const isFunctionalModule = (moduleName: string): boolean => {
  return FUNCTIONAL_MODULES.includes(moduleName);
};

/**
 * Check if a module is in production status
 */
export const isProductionModule = (module: any): boolean => {
  return module.maturity_status === 'production';
};

/**
 * Check if a module is in development
 */
export const isDevelopmentModule = (module: any): boolean => {
  return ['planning', 'alpha', 'beta'].includes(module.maturity_status);
};

/**
 * Get count of functional modules from a list of modules
 */
export const getFunctionalModuleCount = (modules: any[]): number => {
  return modules?.filter(module => isFunctionalModule(module.name)).length || 0;
};

/**
 * Get count of production modules from a list of modules
 */
export const getProductionModuleCount = (modules: any[]): number => {
  return modules?.filter(module => isProductionModule(module)).length || 0;
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
 * Get maturity status badge variant
 */
export const getMaturityStatusVariant = (status: string) => {
  switch (status) {
    case 'production':
      return { variant: 'default' as const, className: 'bg-green-100 text-green-800 border-green-200' };
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
    console.log('Getting progress for module:', module.name, 'development_stage:', module.development_stage);
    
    // First, try to get from new progress tracking system
    if (module.overall_progress !== undefined) {
      console.log('Using overall_progress for', module.name, ':', module.overall_progress);
      return module.overall_progress;
    }
    
    // Fallback to development_stage for backwards compatibility
    let stage;
    if (typeof module.development_stage === 'string') {
      stage = JSON.parse(module.development_stage);
    } else if (typeof module.development_stage === 'object' && module.development_stage !== null) {
      stage = module.development_stage;
    } else {
      console.log('No development_stage found for module:', module.name);
      return 0;
    }
    
    const progress = stage?.progress || 0;
    console.log('Progress for', module.name, ':', progress);
    return progress;
  } catch (error) {
    console.error('Error parsing development_stage for module:', module.name, error);
    return 0;
  }
};

/**
 * Get development stage name from module using the new progress tracking system
 */
export const getDevelopmentStage = (module: any): string => {
  try {
    // First, try to get from new progress tracking system
    if (module.overall_progress !== undefined) {
      if (module.overall_progress >= 90) return 'production';
      if (module.overall_progress >= 80) return 'beta';
      if (module.overall_progress >= 40) return 'alpha';
      return 'planning';
    }
    
    // Fallback to development_stage for backwards compatibility
    let stage;
    if (typeof module.development_stage === 'string') {
      stage = JSON.parse(module.development_stage);
    } else if (typeof module.development_stage === 'object' && module.development_stage !== null) {
      stage = module.development_stage;
    } else {
      return module.maturity_status || 'planning';
    }
    
    return stage?.stage || module.maturity_status || 'planning';
  } catch (error) {
    console.error('Error parsing development_stage:', error);
    return module.maturity_status || 'planning';
  }
};

/**
 * Get remaining requirements for a module using the new progress tracking system
 */
export const getModuleRequirements = (module: any): string[] => {
  try {
    // First, try to get from new progress tracking system
    if (module.overall_progress !== undefined) {
      const progress = module.overall_progress;
      
      if (progress >= 90) return ['Ready for production deployment'];
      if (progress >= 80) return ['Complete integration testing', 'Performance optimization', 'Security review'];
      if (progress >= 60) return ['Complete documentation', 'Fix critical bugs', 'Achieve 85%+ test coverage'];
      if (progress >= 40) return ['Complete feature development', 'Add comprehensive test coverage'];
      if (progress >= 20) return ['Implement core features', 'Add basic test coverage'];
      return ['Complete initial code structure', 'Define test cases'];
    }
    
    // Fallback to development_stage for backwards compatibility
    let stage;
    if (typeof module.development_stage === 'string') {
      stage = JSON.parse(module.development_stage);
    } else if (typeof module.development_stage === 'object' && module.development_stage !== null) {
      stage = module.development_stage;
    } else {
      return [];
    }
    
    return stage?.requirements || [];
  } catch (error) {
    console.error('Error parsing development_stage:', error);
    return [];
  }
};
