
export interface FormDefinition {
  id: string;
  name: string;
  description?: string;
  visibility_scope?: string;
  access_level?: string;
  created_at: string;
  updated_at: string;
  tenant_id?: string;
}

export interface FormField {
  id: string;
  name: string;
  field_type: string;
  field_key?: string;
  required: boolean;
  validation_rules?: any;
  options?: string[];
  placeholder?: string;
  help_text?: string;
  order_index?: number;
}

export interface FormSection {
  id: string;
  name: string;
  description?: string;
  order_index: number;
  fields: FormField[];
}
