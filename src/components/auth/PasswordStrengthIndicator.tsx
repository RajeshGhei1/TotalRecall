
import React from 'react';
import { Check, X } from 'lucide-react';
import { PasswordValidationResult } from '@/utils/passwordValidation';

interface PasswordStrengthIndicatorProps {
  password: string;
  validation: PasswordValidationResult;
  requirements: string[];
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  validation,
  requirements
}) => {
  if (!password) return null;

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'weak':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'strong':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStrengthBarColor = (strength: string) => {
    switch (strength) {
      case 'weak':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'strong':
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getStrengthWidth = (strength: string) => {
    switch (strength) {
      case 'weak':
        return 'w-1/3';
      case 'medium':
        return 'w-2/3';
      case 'strong':
        return 'w-full';
      default:
        return 'w-0';
    }
  };

  return (
    <div className="mt-2 space-y-2">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Password Strength</span>
          <span className={`font-medium capitalize ${getStrengthColor(validation.strength)}`}>
            {validation.strength}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getStrengthBarColor(validation.strength)} ${getStrengthWidth(validation.strength)}`}
          />
        </div>
      </div>

      {/* Requirements List */}
      <div className="space-y-1">
        <p className="text-sm text-gray-600 font-medium">Password Requirements:</p>
        <ul className="space-y-1">
          {requirements.map((requirement, index) => {
            const isRequirementMet = !validation.errors.some(error => 
              error.toLowerCase().includes(requirement.toLowerCase().split(' ').slice(-2).join(' '))
            );
            
            return (
              <li key={index} className="flex items-center gap-2 text-sm">
                {isRequirementMet ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
                <span className={isRequirementMet ? 'text-green-700' : 'text-red-700'}>
                  {requirement}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Error Messages */}
      {validation.errors.length > 0 && (
        <div className="mt-2">
          <ul className="space-y-1">
            {validation.errors.map((error, index) => (
              <li key={index} className="text-sm text-red-600 flex items-center gap-1">
                <X className="h-3 w-3" />
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
