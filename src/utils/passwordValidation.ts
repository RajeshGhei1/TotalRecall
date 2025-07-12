
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';

export interface PasswordRequirements {
  password_min_length: number;
  password_require_uppercase: boolean;
  password_require_lowercase: boolean;
  password_require_numbers: boolean;
  password_require_symbols: boolean;
}

export const DEFAULT_PASSWORD_REQUIREMENTS: PasswordRequirements = {
  password_min_length: 8,
  password_require_uppercase: false,
  password_require_lowercase: false,
  password_require_numbers: false,
  password_require_symbols: false,
};

// Cache for password requirements to avoid repeated DB calls
let cachedRequirements: PasswordRequirements | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function fetchPasswordRequirements(): Promise<PasswordRequirements> {
  // Return cached requirements if still valid
  if (cachedRequirements && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return cachedRequirements;
  }

  try {
    const { data: settings, error } = await supabase
      .from('global_settings')
      .select('setting_key, setting_value')
      .eq('category', 'security')
      .in('setting_key', [
        'password_min_length',
        'password_require_uppercase',
        'password_require_lowercase',
        'password_require_numbers',
        'password_require_symbols'
      ]);

    if (error) {
      console.error('Failed to fetch password requirements:', error);
      return DEFAULT_PASSWORD_REQUIREMENTS;
    }

    const settingsMap = settings?.reduce((acc, setting) => {
      acc[setting.setting_key] = setting.setting_value;
      return acc;
    }, {} as Record<string, unknown>) || {};

    const requirements: PasswordRequirements = {
      password_min_length: settingsMap.password_min_length !== undefined 
        ? Number(settingsMap.password_min_length) 
        : DEFAULT_PASSWORD_REQUIREMENTS.password_min_length,
      password_require_uppercase: settingsMap.password_require_uppercase !== undefined 
        ? Boolean(settingsMap.password_require_uppercase) 
        : DEFAULT_PASSWORD_REQUIREMENTS.password_require_uppercase,
      password_require_lowercase: settingsMap.password_require_lowercase !== undefined 
        ? Boolean(settingsMap.password_require_lowercase) 
        : DEFAULT_PASSWORD_REQUIREMENTS.password_require_lowercase,
      password_require_numbers: settingsMap.password_require_numbers !== undefined 
        ? Boolean(settingsMap.password_require_numbers) 
        : DEFAULT_PASSWORD_REQUIREMENTS.password_require_numbers,
      password_require_symbols: settingsMap.password_require_symbols !== undefined 
        ? Boolean(settingsMap.password_require_symbols) 
        : DEFAULT_PASSWORD_REQUIREMENTS.password_require_symbols,
    };

    // Cache the requirements
    cachedRequirements = requirements;
    cacheTimestamp = Date.now();

    return requirements;
  } catch (error) {
    console.error('Error fetching password requirements:', error);
    return DEFAULT_PASSWORD_REQUIREMENTS;
  }
}

export function createPasswordSchema(requirements: PasswordRequirements) {
  return z.string()
    .min(requirements.password_min_length, `Password must be at least ${requirements.password_min_length} characters`)
    .refine((password) => {
      if (requirements.password_require_uppercase && !/[A-Z]/.test(password)) {
        return false;
      }
      if (requirements.password_require_lowercase && !/[a-z]/.test(password)) {
        return false;
      }
      if (requirements.password_require_numbers && !/\d/.test(password)) {
        return false;
      }
      if (requirements.password_require_symbols && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        return false;
      }
      return true;
    }, {
      message: generatePasswordErrorMessage(requirements)
    });
}

function generatePasswordErrorMessage(requirements: PasswordRequirements): string {
  const messages = [];
  
  if (requirements.password_require_uppercase) {
    messages.push('at least one uppercase letter');
  }
  if (requirements.password_require_lowercase) {
    messages.push('at least one lowercase letter');
  }
  if (requirements.password_require_numbers) {
    messages.push('at least one number');
  }
  if (requirements.password_require_symbols) {
    messages.push('at least one symbol (!@#$%^&*)');
  }

  if (messages.length === 0) {
    return `Password must be at least ${requirements.password_min_length} characters`;
  }

  return `Password must contain ${messages.join(', ')}`;
}

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
}

export function validatePassword(password: string, requirements: PasswordRequirements): PasswordValidationResult {
  const errors: string[] = [];
  let score = 0;

  // Check length
  if (password.length < requirements.password_min_length) {
    errors.push(`Must be at least ${requirements.password_min_length} characters`);
  } else {
    score += 1;
  }

  // Check uppercase
  if (requirements.password_require_uppercase && !/[A-Z]/.test(password)) {
    errors.push('Must contain at least one uppercase letter');
  } else if (/[A-Z]/.test(password)) {
    score += 1;
  }

  // Check lowercase
  if (requirements.password_require_lowercase && !/[a-z]/.test(password)) {
    errors.push('Must contain at least one lowercase letter');
  } else if (/[a-z]/.test(password)) {
    score += 1;
  }

  // Check numbers
  if (requirements.password_require_numbers && !/\d/.test(password)) {
    errors.push('Must contain at least one number');
  } else if (/\d/.test(password)) {
    score += 1;
  }

  // Check symbols
  if (requirements.password_require_symbols && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Must contain at least one symbol (!@#$%^&*)');
  } else if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score += 1;
  }

  // Determine strength
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (score >= 4) {
    strength = 'strong';
  } else if (score >= 2) {
    strength = 'medium';
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength
  };
}

export function invalidatePasswordRequirementsCache(): void {
  cachedRequirements = null;
  cacheTimestamp = 0;
}
