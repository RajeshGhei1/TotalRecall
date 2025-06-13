
import { useCallback } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';

export const useFormValidation = () => {
  const validateWithSchema = useCallback(<T>(
    schema: z.ZodSchema<T>,
    data: unknown,
    options?: {
      showErrors?: boolean;
      fieldName?: string;
    }
  ): { success: true; data: T } | { success: false; errors: z.ZodError } => {
    try {
      const validatedData = schema.parse(data);
      return { success: true, data: validatedData };
    } catch (error) {
      if (error instanceof z.ZodError) {
        if (options?.showErrors) {
          const firstError = error.errors[0];
          toast.error(`Validation Error${options.fieldName ? ` in ${options.fieldName}` : ''}`, {
            description: firstError?.message || 'Invalid data provided',
          });
        }
        return { success: false, errors: error };
      }
      throw error;
    }
  }, []);

  const sanitizeInput = useCallback((input: string): string => {
    // Basic XSS prevention
    return input
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .trim();
  }, []);

  const validateRequired = useCallback((value: any, fieldName: string): boolean => {
    if (value === null || value === undefined || value === '') {
      toast.error('Validation Error', {
        description: `${fieldName} is required`,
      });
      return false;
    }
    return true;
  }, []);

  return {
    validateWithSchema,
    sanitizeInput,
    validateRequired,
  };
};
