
export interface FormDefinition {
  id: string;
  tenant_id?: string;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
  settings: Record<string, any>;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface FormSection {
  id: string;
  form_id: string;
  name: string;
  description?: string;
  sort_order: number;
  is_collapsible: boolean;
  created_at: string;
  updated_at: string;
}

export interface FormSubmission {
  id: string;
  form_id: string;
  submitted_by?: string;
  submission_data: Record<string, any>;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  submitted_at?: string;
  created_at: string;
  updated_at: string;
}

export interface FormField {
  id: string;
  name: string;
  field_key: string;
  field_type: string;
  required?: boolean;
  options?: any;
  form_id?: string;
  section_id?: string;
  sort_order?: number;
  description?: string;
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
