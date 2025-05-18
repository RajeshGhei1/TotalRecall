
// Type definitions for custom fields functionality
import { UseQueryResult } from '@tanstack/react-query';

export interface CustomField {
  id: string;
  tenant_id: string | null;
  name: string;
  field_key: string;
  field_type: string;
  required: boolean;
  options?: Record<string, any>;
  applicable_forms?: string[] | null;
  description?: string;
  created_at: string;
  updated_at: string;
  sort_order?: number;
}

export interface CustomFieldValue {
  id: string;
  field_id: string;
  entity_id: string;
  entity_type: string;
  value: any;
  custom_fields?: CustomField;
  created_at?: string;
  updated_at?: string;
}

export interface UseCustomFieldsOptions {
  formContext?: string;
}

export interface UseCustomFieldsReturn {
  customFields: CustomField[];
  isLoading: boolean;
  getCustomFieldValues: (entityType: string, entityId: string) => Promise<any[]>;
  saveCustomFieldValues: (entityType: string, entityId: string, values: Record<string, any>) => Promise<void>;
  updateFieldOrder: (fields: CustomField[], tenantId?: string, formContext?: string) => Promise<any>;
}

// Export interface for form values
export interface FieldFormValues {
  name: string;            // Required field as per the error message
  label: string;
  fieldType: "text" | "textarea" | "dropdown" | "number" | "boolean" | "date";
  required: boolean;
  placeholder?: string;
  defaultValue?: string;
  minLength?: number;
  maxLength?: number;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: string;
  forms: string[];
  info?: string;
  validation?: string;
}
