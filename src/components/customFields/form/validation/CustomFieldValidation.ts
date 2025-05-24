
import { z } from 'zod';

// Define validation schemas for different field types
export const baseFieldSchema = z.object({
  name: z.string()
    .min(1, 'Field name is required')
    .max(100, 'Field name must be less than 100 characters')
    .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, 'Field name must start with a letter and contain only letters, numbers, and underscores'),
  
  label: z.string()
    .min(1, 'Field label is required')
    .max(200, 'Field label must be less than 200 characters'),
  
  fieldType: z.enum(['text', 'textarea', 'number', 'date', 'boolean', 'select', 'multiselect']),
  
  required: z.boolean().optional().default(false),
  
  placeholder: z.string()
    .max(500, 'Placeholder must be less than 500 characters')
    .optional(),
  
  info: z.string()
    .max(1000, 'Help text must be less than 1000 characters')
    .optional(),
  
  forms: z.array(z.string()).optional().default([]),
});

// Text field specific validation
export const textFieldSchema = baseFieldSchema.extend({
  fieldType: z.literal('text'),
  minLength: z.number()
    .min(0, 'Minimum length cannot be negative')
    .max(10000, 'Minimum length cannot exceed 10000')
    .optional(),
  maxLength: z.number()
    .min(1, 'Maximum length must be at least 1')
    .max(10000, 'Maximum length cannot exceed 10000')
    .optional(),
  defaultValue: z.string().optional(),
}).refine(
  (data) => !data.minLength || !data.maxLength || data.minLength <= data.maxLength,
  {
    message: 'Minimum length cannot be greater than maximum length',
    path: ['minLength'],
  }
);

// Number field specific validation
export const numberFieldSchema = baseFieldSchema.extend({
  fieldType: z.literal('number'),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number()
    .positive('Step must be positive')
    .optional(),
  defaultValue: z.number().optional(),
}).refine(
  (data) => !data.min || !data.max || data.min <= data.max,
  {
    message: 'Minimum value cannot be greater than maximum value',
    path: ['min'],
  }
);

// Select field specific validation
export const selectFieldSchema = baseFieldSchema.extend({
  fieldType: z.union([z.literal('select'), z.literal('multiselect')]),
  options: z.array(z.object({
    value: z.string().min(1, 'Option value is required'),
    label: z.string().min(1, 'Option label is required'),
  })).min(1, 'At least one option is required for select fields'),
});

// Boolean field validation
export const booleanFieldSchema = baseFieldSchema.extend({
  fieldType: z.literal('boolean'),
  defaultValue: z.boolean().optional(),
});

// Date field validation
export const dateFieldSchema = baseFieldSchema.extend({
  fieldType: z.literal('date'),
  defaultValue: z.string().optional(),
});

// Textarea field validation
export const textareaFieldSchema = baseFieldSchema.extend({
  fieldType: z.literal('textarea'),
  minLength: z.number()
    .min(0, 'Minimum length cannot be negative')
    .max(10000, 'Minimum length cannot exceed 10000')
    .optional(),
  maxLength: z.number()
    .min(1, 'Maximum length must be at least 1')
    .max(10000, 'Maximum length cannot exceed 10000')
    .optional(),
  defaultValue: z.string().optional(),
}).refine(
  (data) => !data.minLength || !data.maxLength || data.minLength <= data.maxLength,
  {
    message: 'Minimum length cannot be greater than maximum length',
    path: ['minLength'],
  }
);

// Main validation function
export const validateCustomField = (data: any) => {
  try {
    switch (data.fieldType) {
      case 'text':
        return textFieldSchema.parse(data);
      case 'textarea':
        return textareaFieldSchema.parse(data);
      case 'number':
        return numberFieldSchema.parse(data);
      case 'date':
        return dateFieldSchema.parse(data);
      case 'boolean':
        return booleanFieldSchema.parse(data);
      case 'select':
      case 'multiselect':
        return selectFieldSchema.parse(data);
      default:
        return baseFieldSchema.parse(data);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.errors.map(e => e.message).join(', '));
    }
    throw error;
  }
};

export type ValidatedCustomField = 
  | z.infer<typeof textFieldSchema>
  | z.infer<typeof textareaFieldSchema>
  | z.infer<typeof numberFieldSchema>
  | z.infer<typeof dateFieldSchema>
  | z.infer<typeof booleanFieldSchema>
  | z.infer<typeof selectFieldSchema>;
