
// Module styling utilities

import { ModuleColors, MaturityStatusVariant } from './types';

/**
 * Get green color classes for functional modules
 */
export const getFunctionalModuleColors = (): ModuleColors => ({
  background: 'bg-green-50',
  border: 'border-green-200', 
  text: 'text-green-700',
  leftBorder: 'border-l-green-500'
});

/**
 * Get production-ready color classes
 */
export const getProductionReadyColors = (): ModuleColors => ({
  background: 'bg-emerald-50',
  border: 'border-emerald-300',
  text: 'text-emerald-800', 
  leftBorder: 'border-l-emerald-600'
});

/**
 * Get maturity status badge variant with improved logic
 */
export const getMaturityStatusVariant = (status: string, progress?: number): MaturityStatusVariant => {
  // Use progress data if available for more accurate status
  if (progress !== undefined) {
    if (progress >= 90) {
      return { variant: 'default', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    } else if (progress >= 80) {
      return { variant: 'secondary', className: 'bg-blue-100 text-blue-800 border-blue-200' };
    } else if (progress >= 40) {
      return { variant: 'outline', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    } else {
      return { variant: 'outline', className: 'bg-gray-100 text-gray-800 border-gray-200' };
    }
  }

  // Fallback to status-based logic
  switch (status) {
    case 'production':
      return { variant: 'default', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    case 'beta':
      return { variant: 'secondary', className: 'bg-blue-100 text-blue-800 border-blue-200' };
    case 'alpha':
      return { variant: 'outline', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    case 'planning':
      return { variant: 'outline', className: 'bg-gray-100 text-gray-800 border-gray-200' };
    default:
      return { variant: 'outline', className: 'bg-gray-100 text-gray-800 border-gray-200' };
  }
};
