
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

// New deployment and integration types
export interface FormDeploymentPoint {
  id: string;
  name: string;
  description?: string;
  location: 'dashboard_widget' | 'modal_dialog' | 'dedicated_page' | 'navigation_item' | 'inline_embed' | 'sidebar_panel';
  target_path?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FormPlacement {
  id: string;
  form_id: string;
  deployment_point_id: string;
  tenant_id?: string;
  module_id?: string;
  status: 'active' | 'inactive' | 'scheduled' | 'expired';
  priority: number;
  configuration: Record<string, any>;
  starts_at?: string;
  ends_at?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface FormTrigger {
  id: string;
  placement_id: string;
  trigger_type: 'user_action' | 'page_load' | 'scheduled' | 'conditional' | 'manual';
  trigger_conditions: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FormResponse {
  id: string;
  form_id: string;
  placement_id?: string;
  tenant_id?: string;
  submitted_by?: string;
  response_data: Record<string, any>;
  status: string;
  submitted_at: string;
  processed_at?: string;
  created_at: string;
  updated_at: string;
}

// NEW: Workflow and Analytics types
export interface FormWorkflow {
  id: string;
  form_id: string;
  name: string;
  description?: string;
  trigger_conditions: Record<string, any>;
  workflow_steps: WorkflowStep[];
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkflowStep {
  type: 'notification' | 'data_processing' | 'assignment' | 'webhook' | 'condition';
  action: string;
  config: Record<string, any>;
  order?: number;
}

export interface FormNotification {
  id: string;
  workflow_id: string;
  notification_type: 'email' | 'sms' | 'in_app' | 'webhook';
  template_data: Record<string, any>;
  recipients: string[];
  trigger_event: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FormResponseAnalytics {
  id: string;
  form_id: string;
  placement_id?: string;
  response_id?: string;
  event_type: 'form_view' | 'form_start' | 'form_submit' | 'form_abandon';
  event_data: Record<string, any>;
  user_agent?: string;
  ip_address?: string;
  session_id?: string;
  tenant_id?: string;
  created_at: string;
}

export interface WorkflowExecutionLog {
  id: string;
  workflow_id: string;
  response_id: string;
  execution_status: 'pending' | 'running' | 'completed' | 'failed';
  step_results: Record<string, any>[];
  error_message?: string;
  started_at: string;
  completed_at?: string;
  created_at: string;
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

// New insert types for deployment system
export type FormDeploymentPointInsert = Omit<FormDeploymentPoint, 'id' | 'created_at' | 'updated_at'>;
export type FormPlacementInsert = Omit<FormPlacement, 'id' | 'created_at' | 'updated_at'>;
export type FormTriggerInsert = Omit<FormTrigger, 'id' | 'created_at' | 'updated_at'>;
export type FormResponseInsert = Omit<FormResponse, 'id' | 'created_at' | 'updated_at'>;

// NEW: Insert types for workflow system
export type FormWorkflowInsert = Omit<FormWorkflow, 'id' | 'created_at' | 'updated_at'>;
export type FormNotificationInsert = Omit<FormNotification, 'id' | 'created_at' | 'updated_at'>;
export type FormResponseAnalyticsInsert = Omit<FormResponseAnalytics, 'id' | 'created_at'>;
export type WorkflowExecutionLogInsert = Omit<WorkflowExecutionLog, 'id' | 'created_at'>;
