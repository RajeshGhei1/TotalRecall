
// Type definitions for custom fields functionality
import { UseQueryResult } from '@tanstack/react-query';

export interface CustomField {
  id: string;
  tenant_id: string;
  name: string;
  field_key: string;
  field_type: string;
  required: boolean;
  options?: Record<string, any>;
  applicable_forms?: string[] | null;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CustomFieldValue {
  id: string;
  field_id: string;
  entity_id: string;
  entity_type: string;
  value: any;
  custom_fields?: CustomField;
}

export interface UseCustomFieldsOptions {
  formContext?: string;
}

export interface UseCustomFieldsReturn {
  customFields: CustomField[];
  isLoading: boolean;
  getCustomFieldValues: (entityType: string, entityId: string) => Promise<any[]>;
  saveCustomFieldValues: (entityType: string, entityId: string, values: Record<string, any>) => Promise<void>;
}
