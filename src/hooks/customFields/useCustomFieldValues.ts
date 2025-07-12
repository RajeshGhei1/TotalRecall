
import { supabase } from '@/integrations/supabase/client';
import { CustomField, CustomFieldValue } from './types';
import { fetchCustomFieldValues } from './operations/fetchCustomFieldValues';
import { saveCustomFieldValues } from './operations/saveCustomFieldValues';
import { Json } from '@/integrations/supabase/types';

/**
 * Hook for managing custom field values
 */
export function useCustomFieldValues() {
  const getValues = async (entityType: string, entityId: string): Promise<CustomFieldValue[]> => {
    return fetchCustomFieldValues(entityType, entityId);
  };

  // Create a function that matches both interfaces
  // Note: This implementation allows calling with or without customFields parameter
  const saveValues = async (
    entityType: string, 
    entityId: string, 
    values: Record<string, any>,
    customFields?: CustomField[]
  ): Promise<unknown> => {
    if (customFields) {
      return saveCustomFieldValues(entityType, entityId, values, customFields);
    } else {
      // For backward compatibility, try to get fields from the database
      const { data: fields } = await supabase
        .from('custom_fields')
        .select('*');
      
      if (!fields || fields.length === 0) {
        console.warn('No custom fields found when saving values');
        return false;
      }

      // Transform the database fields to match our CustomField type
      const processAndReturnCustomFields = (data) => {
        try {
          return (data || []).map((field, index) => {
            // Handle options parsing safely
            let parsedOptions: Record<string, any> | Json | string | number | boolean;
            if (typeof field.options === 'string') {
              try {
                parsedOptions = JSON.parse(field.options);
              } catch (e) {
                parsedOptions = field.options;
              }
            } else {
              parsedOptions = field.options || {};
            }
            
            // Handle applicable_forms parsing
            let applicableForms: string[] | null;
            if (typeof field.applicable_forms === 'string') {
              try {
                applicableForms = JSON.parse(field.applicable_forms);
              } catch (e) {
                applicableForms = [];
              }
            } else if (Array.isArray(field.applicable_forms)) {
              applicableForms = field.applicable_forms;
            } else {
              applicableForms = field.applicable_forms ? [field.applicable_forms.toString()] : null;
            }
            
            return {
              ...field,
              id: field.id,
              name: field.name,
              field_key: field.field_key,
              field_type: field.field_type,
              required: field.required || false,
              tenant_id: field.tenant_id,
              // Handle the sort_order field specifically to avoid TS error
              sort_order: 'sort_order' in field ? field.sort_order : index,
              description: field.description || '',
              options: parsedOptions,
              applicable_forms: applicableForms,
              created_at: field.created_at,
              updated_at: field.updated_at
            } as CustomField;
          });
        } catch (error) {
          console.error("Error processing custom fields:", error);
          return [];
        }
      };
      
      const typedFields = processAndReturnCustomFields(fields);
      
      return saveCustomFieldValues(entityType, entityId, values, typedFields);
    }
  };

  return {
    getCustomFieldValues: getValues,
    saveCustomFieldValues: saveValues
  };
}

export { fetchCustomFieldValues };
