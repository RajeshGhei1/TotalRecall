
import { Database } from '@/integrations/supabase/types';

// Use Supabase generated types as the base
type DbFormDefinition = Database['public']['Tables']['form_definitions']['Row'];
type DbFormSection = Database['public']['Tables']['form_sections']['Row'];
type DbFormSubmission = Database['public']['Tables']['form_submissions']['Row'];
type DbCustomField = Database['public']['Tables']['custom_fields']['Row'];

// Extend with our custom interfaces for better type safety
export interface FormDefinition extends Omit<DbFormDefinition, 'settings' | 'required_modules'> {
  settings: Record<string, any>;
  required_modules: string[];
  visibility_scope: 'global' | 'tenant_specific' | 'module_specific';
  access_level: 'public' | 'authenticated' | 'role_based';
}

export interface FormSection extends DbFormSection {}

export interface FormSubmission extends Omit<DbFormSubmission, 'submission_data'> {
  submission_data: Record<string, any>;
}

export interface FormField extends Omit<DbCustomField, 'options' | 'applicable_forms'> {
  options?: any;
  applicable_forms?: string[];
}

// New interface for form-module assignments
export interface FormModuleAssignment {
  id: string;
  form_id: string;
  module_id: string;
  created_at: string;
  updated_at: string;
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

// Enhanced insert types for database operations
export type FormDefinitionInsert = Database['public']['Tables']['form_definitions']['Insert'] & {
  visibility_scope?: 'global' | 'tenant_specific' | 'module_specific';
  required_modules?: string[];
  access_level?: 'public' | 'authenticated' | 'role_based';
};

export type FormSectionInsert = Database['public']['Tables']['form_sections']['Insert'];
export type FormFieldInsert = Database['public']['Tables']['custom_fields']['Insert'];
export type FormSubmissionInsert = Database['public']['Tables']['form_submissions']['Insert'];
export type FormModuleAssignmentInsert = {
  form_id: string;
  module_id: string;
};
