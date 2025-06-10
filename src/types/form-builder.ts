export interface FormDefinition {
  id: string;
  name: string;
  slug: string;
  description?: string;
  visibility_scope?: string;
  access_level?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  tenant_id?: string;
  settings?: any;
  required_modules?: string[];
}

export interface FormDefinitionInsert {
  name: string;
  slug: string;
  description?: string;
  visibility_scope?: string;
  access_level?: string;
  is_active?: boolean;
  created_by?: string;
  tenant_id?: string;
  settings?: any;
  required_modules?: string[];
}

// Enhanced options interface for multi-select fields
export interface EnhancedFieldOptions {
  options?: Array<{ value: string; label: string; }>;
  multiSelect?: boolean;
  maxSelections?: number;
  minSelections?: number;
  allowCustomValues?: boolean;
  searchable?: boolean;
}

export interface FormField {
  id: string;
  name: string;
  field_type: string;
  field_key?: string;
  required: boolean;
  validation_rules?: any;
  options?: string[] | EnhancedFieldOptions;
  placeholder?: string;
  help_text?: string;
  order_index?: number;
  description?: string;
  section_id?: string;
  form_id?: string;
  sort_order?: number;
  tenant_id?: string;
  created_at?: string;
  updated_at?: string;
  applicable_forms?: string[];
}

export interface FormFieldInsert {
  name: string;
  field_type: string;
  field_key: string;
  required?: boolean;
  validation_rules?: any;
  options?: any;
  placeholder?: string;
  help_text?: string;
  description?: string;
  section_id?: string;
  form_id?: string;
  sort_order?: number;
  tenant_id?: string;
  applicable_forms?: any;
}

export interface FormSection {
  id: string;
  name: string;
  description?: string;
  order_index: number;
  fields: FormField[];
  form_id: string;
  sort_order: number;
  is_collapsible: boolean;
  created_at: string;
  updated_at: string;
}

export interface FormSectionInsert {
  name: string;
  description?: string;
  form_id: string;
  sort_order?: number;
  is_collapsible?: boolean;
}

export interface FormPlacement {
  id: string;
  form_id: string;
  deployment_point_id: string;
  module_id?: string;
  tenant_id?: string;
  status: 'active' | 'inactive' | 'scheduled' | 'expired';
  priority: number;
  configuration?: any;
  starts_at?: string;
  ends_at?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface FormPlacementInsert {
  form_id: string;
  deployment_point_id: string;
  module_id?: string;
  tenant_id?: string;
  status?: 'active' | 'inactive' | 'scheduled' | 'expired';
  priority?: number;
  configuration?: any;
  starts_at?: string;
  ends_at?: string;
  created_by?: string;
}

export interface FormDeploymentPoint {
  id: string;
  name: string;
  location: string;
  description?: string;
  target_path?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FormDeploymentPointInsert {
  name: string;
  location: string;
  description?: string;
  target_path?: string;
  is_active?: boolean;
}

export interface FormTrigger {
  id: string;
  placement_id: string;
  trigger_type: string;
  trigger_conditions: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FormTriggerInsert {
  placement_id: string;
  trigger_type: string;
  trigger_conditions: any;
  is_active?: boolean;
}

export interface FormResponse {
  id: string;
  form_id: string;
  placement_id?: string;
  response_data: any;
  submitted_by?: string;
  tenant_id?: string;
  status: string;
  submitted_at: string;
  processed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface FormResponseAnalytics {
  id: string;
  form_id: string;
  placement_id?: string;
  response_id?: string;
  event_type: string;
  event_data: any;
  session_id?: string;
  user_agent?: string;
  ip_address?: string;
  tenant_id?: string;
  created_at: string;
}

export interface FormResponseAnalyticsInsert {
  form_id: string;
  placement_id?: string;
  response_id?: string;
  event_type: string;
  event_data: any;
  session_id?: string;
  user_agent?: string;
  ip_address?: string;
  tenant_id?: string;
}

export interface WorkflowStep {
  id: string;
  step_type: string;
  type: string;
  action: string;
  step_config: any;
  config?: any;
  order_index: number;
  order?: number;
}

export interface FormWorkflow {
  id: string;
  form_id: string;
  name: string;
  description?: string;
  trigger_conditions: any;
  workflow_steps: WorkflowStep[];
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface FormWorkflowInsert {
  form_id: string;
  name: string;
  description?: string;
  trigger_conditions: any;
  workflow_steps: WorkflowStep[];
  is_active?: boolean;
  created_by?: string;
}

export interface FormNotification {
  id: string;
  workflow_id?: string;
  notification_type: string;
  trigger_event: string;
  recipients: string[];
  template_data: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FormNotificationInsert {
  workflow_id?: string;
  notification_type: string;
  trigger_event: string;
  recipients: string[];
  template_data: Record<string, any>;
  is_active?: boolean;
}

export interface WorkflowExecutionLog {
  id: string;
  workflow_id: string;
  response_id?: string;
  status: string;
  step_results: Record<string, any>[];
  error_message?: string;
  created_at: string;
  completed_at?: string;
}

export interface FormModuleAssignment {
  id: string;
  form_id: string;
  module_id: string;
  created_at: string;
  updated_at: string;
}

export interface FormModuleAssignmentInsert {
  form_id: string;
  module_id: string;
}

export interface FieldDefinition {
  type: string;
  label: string;
  icon: string;
  description: string;
  defaultOptions?: any;
}

export type FieldType = 'text' | 'textarea' | 'number' | 'email' | 'date' | 'dropdown' | 'multiselect' | 'checkbox' | 'radio' | 'boolean' | 'rating';
