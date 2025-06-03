
import { useState, useEffect } from 'react';
import { z } from 'zod';
import { fetchPasswordRequirements, createPasswordSchema, validatePassword, PasswordRequirements, DEFAULT_PASSWORD_REQUIREMENTS, PasswordValidationResult } from '@/utils/passwordValidation';

export function usePasswordRequirements() {
  const [requirements, setRequirements] = useState<PasswordRequirements>(DEFAULT_PASSWORD_REQUIREMENTS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRequirements = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedRequirements = await fetchPasswordRequirements();
        setRequirements(fetchedRequirements);
      } catch (err) {
        console.error('Failed to load password requirements:', err);
        setError('Failed to load password requirements');
        setRequirements(DEFAULT_PASSWORD_REQUIREMENTS);
      } finally {
        setIsLoading(false);
      }
    };

    loadRequirements();
  }, []);

  const passwordSchema = createPasswordSchema(requirements);

  const validatePasswordStrength = (password: string): PasswordValidationResult => {
    return validatePassword(password, requirements);
  };

  const getRequirementsList = (): string[] => {
    const list = [`At least ${requirements.password_min_length} characters`];
    
    if (requirements.password_require_uppercase) {
      list.push('At least one uppercase letter (A-Z)');
    }
    if (requirements.password_require_lowercase) {
      list.push('At least one lowercase letter (a-z)');
    }
    if (requirements.password_require_numbers) {
      list.push('At least one number (0-9)');
    }
    if (requirements.password_require_symbols) {
      list.push('At least one symbol (!@#$%^&*)');
    }

    return list;
  };

  return {
    requirements,
    passwordSchema,
    validatePasswordStrength,
    getRequirementsList,
    isLoading,
    error
  };
}
