
// Enhanced form builder types with multi-select support
export interface MultiSelectOption {
  value: string;
  label: string;
  icon?: string;
  color?: string;
  disabled?: boolean;
}

export interface MultiSelectFieldOptions {
  options: MultiSelectOption[];
  multiSelect: boolean;
  maxSelections?: number;
  minSelections?: number;
  allowCustomValues?: boolean;
  searchable?: boolean;
  groupBy?: string;
  category?: string;
}

// Extend existing FieldType with multi-select variants
export type EnhancedFieldType = 
  | 'text' 
  | 'textarea' 
  | 'number' 
  | 'email' 
  | 'date' 
  | 'dropdown' 
  | 'multiselect'
  | 'checkbox' 
  | 'radio' 
  | 'boolean' 
  | 'rating'
  | 'multi-checkbox'
  | 'tag-input'
  | 'hierarchical-select';

export interface EnhancedFormField {
  id: string;
  name: string;
  field_type: EnhancedFieldType;
  field_key?: string;
  required: boolean;
  validation_rules?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: string;
  };
  options?: MultiSelectFieldOptions | any;
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

export interface FilterConfig {
  multiSelect: boolean;
  operators: string[];
  defaultOperator: string;
  maxSelections?: number;
}

export interface ReportFilter {
  id: string;
  field: string;
  operator: string;
  value: any;
  label: string;
  type: EnhancedFieldType;
  config: FilterConfig;
}

export interface EnhancedReportConfig {
  filters: ReportFilter[];
  columns: string[];
  groupBy?: string[];
  sortBy?: string[];
  aggregations?: {
    field: string;
    function: 'count' | 'sum' | 'avg' | 'min' | 'max';
  }[];
}
