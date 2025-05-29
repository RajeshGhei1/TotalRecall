
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
        message: 'This operation conflicts with existing data. Please try again.',
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

    if (error.message.includes('JWT')) {
      return {
        message: 'Authentication expired. Please refresh the page and try again.',
        code: 'AUTH_ERROR',
        context,
      };
    }

    if (error.message.includes('timeout')) {
      return {
        message: 'Request timed out. Please try again.',
        code: 'TIMEOUT_ERROR',
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

      // Exponential backoff with jitter
      const backoffDelay = delay * Math.pow(2, attempt - 1) + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
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

// Utility for safe async operations with error boundaries
export const safeAsync = async <T>(
  operation: () => Promise<T>,
  fallback?: T,
  context?: string
): Promise<T | undefined> => {
  try {
    return await operation();
  } catch (error) {
    console.error(`Safe async operation failed in ${context}:`, error);
    return fallback;
  }
};
