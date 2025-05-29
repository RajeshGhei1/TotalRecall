
import { Database } from '@/integrations/supabase/types';

// Use Supabase generated types as the base
type DbFormDefinition = Database['public']['Tables']['form_definitions']['Row'];
type DbFormSection = Database['public']['Tables']['form_sections']['Row'];
type DbFormSubmission = Database['public']['Tables']['form_submissions']['Row'];
type DbCustomField = Database['public']['Tables']['custom_fields']['Row'];

// Extend with our custom interfaces for better type safety
export interface FormDefinition extends Omit<DbFormDefinition, 'settings'> {
  settings: Record<string, any>;
}

export interface FormSection extends DbFormSection {}

export interface FormSubmission extends Omit<DbFormSubmission, 'submission_data'> {
  submission_data: Record<string, any>;
}

export interface FormField extends Omit<DbCustomField, 'options' | 'applicable_forms'> {
  options?: any;
  applicable_forms?: string[];
}

export interface FormBuilderState {
  formDefinition: Partial<FormDefinition>;
  sections: FormSection[];
  fields: FormField[];
  selectedSection?: string;
  selectedField?: string;
  previewMode: boolean;
}

export type FieldType = 
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'phone'
  | 'date'
  | 'dropdown'
  | 'radio'
  | 'checkbox'
  | 'boolean'
  | 'file'
  | 'signature'
  | 'rating'
  | 'matrix';

export interface FieldDefinition {
  type: FieldType;
  label: string;
  icon: string;
  description: string;
  defaultOptions?: any;
}

// Insert types for database operations
export type FormDefinitionInsert = Database['public']['Tables']['form_definitions']['Insert'];
export type FormSectionInsert = Database['public']['Tables']['form_sections']['Insert'];
export type FormFieldInsert = Database['public']['Tables']['custom_fields']['Insert'];
export type FormSubmissionInsert = Database['public']['Tables']['form_submissions']['Insert'];
