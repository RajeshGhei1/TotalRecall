
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
 * Get progress percentage for development stage
 */
export const getDevelopmentProgress = (module: any): number => {
  try {
    const stage = typeof module.development_stage === 'string' 
      ? JSON.parse(module.development_stage) 
      : module.development_stage;
    return stage?.progress || 0;
  } catch {
    return 0;
  }
};
