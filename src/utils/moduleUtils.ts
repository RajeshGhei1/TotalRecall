
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
  'AI Orchestration'
];

/**
 * Check if a module is functional (fully implemented)
 */
export const isFunctionalModule = (moduleName: string): boolean => {
  return FUNCTIONAL_MODULES.includes(moduleName);
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
