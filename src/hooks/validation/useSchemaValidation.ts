
import { useCallback } from 'react';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

// JSON Schema for form configuration validation
const formConfigSchema = z.object({
  name: z.string().min(1, 'Form name is required'),
  slug: z.string().min(1, 'Form slug is required'),
  description: z.string().optional(),
  visibility_scope: z.enum(['global', 'tenant', 'private']).optional(),
  access_level: z.enum(['public', 'authenticated', 'restricted']).optional(),
  settings: z.object({
    allowAnonymous: z.boolean().optional(),
    requireLogin: z.boolean().optional(),
    submitLimit: z.number().min(0).optional(),
    expiresAt: z.string().datetime().optional(),
  }).optional(),
  required_modules: z.array(z.string()).optional(),
});

// JSON Schema for report configuration validation
const reportConfigSchema = z.object({
  name: z.string().min(1, 'Report name is required'),
  entity: z.string().min(1, 'Entity is required'),
  columns: z.array(z.string()).min(1, 'At least one column is required'),
  filters: z.array(z.object({
    field: z.string().min(1),
    operator: z.enum(['equals', 'contains', 'greater_than', 'less_than', 'between']),
    value: z.string().min(1),
  })).optional(),
  group_by: z.string().optional(),
  aggregation: z.array(z.object({
    function: z.enum(['count', 'sum', 'avg', 'min', 'max']),
    field: z.string().min(1),
  })).optional(),
  visualization_type: z.enum(['table', 'chart', 'graph']).optional(),
});

// Field configuration schema
const fieldConfigSchema = z.object({
  name: z.string().min(1, 'Field name is required'),
  field_type: z.enum([
    'text', 'textarea', 'number', 'email', 'date', 
    'dropdown', 'multiselect', 'checkbox', 'radio', 'boolean', 'rating'
  ]),
  field_key: z.string().min(1, 'Field key is required'),
  required: z.boolean().optional(),
  validation_rules: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    pattern: z.string().optional(),
    custom: z.string().optional(),
  }).optional(),
  options: z.union([
    z.array(z.string()),
    z.object({
      options: z.array(z.object({
        value: z.string(),
        label: z.string(),
      })),
      multiSelect: z.boolean().optional(),
      maxSelections: z.number().optional(),
      allowCustomValues: z.boolean().optional(),
    })
  ]).optional(),
  placeholder: z.string().optional(),
  help_text: z.string().optional(),
});

/**
 * Hook for JSON schema validation of configurations
 */
export const useSchemaValidation = () => {
  const { toast } = useToast();

  const validateFormConfig = useCallback((config: unknown) => {
    try {
      const validatedConfig = formConfigSchema.parse(config);
      return { success: true, data: validatedConfig, errors: null };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        }));
        
        toast({
          title: 'Form Configuration Invalid',
          description: `Validation failed: ${errors[0]?.message}`,
          variant: 'destructive',
        });
        
        return { success: false, data: null, errors };
      }
      
      return { success: false, data: null, errors: [{ path: 'unknown', message: 'Validation failed' }] };
    }
  }, [toast]);

  const validateReportConfig = useCallback((config: unknown) => {
    try {
      const validatedConfig = reportConfigSchema.parse(config);
      return { success: true, data: validatedConfig, errors: null };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        }));
        
        toast({
          title: 'Report Configuration Invalid',
          description: `Validation failed: ${errors[0]?.message}`,
          variant: 'destructive',
        });
        
        return { success: false, data: null, errors };
      }
      
      return { success: false, data: null, errors: [{ path: 'unknown', message: 'Validation failed' }] };
    }
  }, [toast]);

  const validateFieldConfig = useCallback((config: unknown) => {
    try {
      const validatedConfig = fieldConfigSchema.parse(config);
      return { success: true, data: validatedConfig, errors: null };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        }));
        
        toast({
          title: 'Field Configuration Invalid',
          description: `Validation failed: ${errors[0]?.message}`,
          variant: 'destructive',
        });
        
        return { success: false, data: null, errors };
      }
      
      return { success: false, data: null, errors: [{ path: 'unknown', message: 'Validation failed' }] };
    }
  }, [toast]);

  const validateGeneric = useCallback(<T>(schema: z.ZodSchema<T>, data: unknown, errorTitle = 'Validation Error') => {
    try {
      const validatedData = schema.parse(data);
      return { success: true, data: validatedData, errors: null };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        }));
        
        toast({
          title: errorTitle,
          description: `Validation failed: ${errors[0]?.message}`,
          variant: 'destructive',
        });
        
        return { success: false, data: null, errors };
      }
      
      return { success: false, data: null, errors: [{ path: 'unknown', message: 'Validation failed' }] };
    }
  }, [toast]);

  return {
    validateFormConfig,
    validateReportConfig,
    validateFieldConfig,
    validateGeneric,
    schemas: {
      formConfig: formConfigSchema,
      reportConfig: reportConfigSchema,
      fieldConfig: fieldConfigSchema,
    },
  };
};
