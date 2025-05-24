
import { toast } from 'sonner';

export interface ErrorDetails {
  message: string;
  code?: string;
  context?: string;
}

export class AppError extends Error {
  public code?: string;
  public context?: string;

  constructor(message: string, code?: string, context?: string) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.context = context;
  }
}

export const handleError = (error: unknown, context?: string): ErrorDetails => {
  console.error(`Error in ${context || 'application'}:`, error);

  if (error instanceof AppError) {
    return {
      message: error.message,
      code: error.code,
      context: error.context || context,
    };
  }

  if (error instanceof Error) {
    // Handle common Supabase errors
    if (error.message.includes('violates row-level security')) {
      return {
        message: 'You do not have permission to perform this action',
        code: 'PERMISSION_DENIED',
        context,
      };
    }

    if (error.message.includes('duplicate key value')) {
      return {
        message: 'This record already exists',
        code: 'DUPLICATE_RECORD',
        context,
      };
    }

    if (error.message.includes('network') || error.message.includes('fetch')) {
      return {
        message: 'Network connection error. Please check your internet connection.',
        code: 'NETWORK_ERROR',
        context,
      };
    }

    return {
      message: error.message,
      context,
    };
  }

  return {
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
    context,
  };
};

export const showErrorToast = (error: unknown, context?: string) => {
  const errorDetails = handleError(error, context);
  
  toast.error('Error', {
    description: errorDetails.message,
  });

  return errorDetails;
};

export const showSuccessToast = (message: string, description?: string) => {
  toast.success(message, {
    description,
  });
};

// Utility for retrying async operations
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        break;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }

  throw lastError;
};

// Utility for handling form submission errors
export const handleFormError = (error: unknown, context: string = 'form submission') => {
  const errorDetails = handleError(error, context);
  
  // Return a user-friendly error message for forms
  if (errorDetails.code === 'VALIDATION_ERROR') {
    return errorDetails.message;
  }
  
  showErrorToast(error, context);
  return 'An error occurred while processing your request';
};
