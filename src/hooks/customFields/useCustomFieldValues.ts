
import { supabase } from '@/integrations/supabase/client';
import { CustomField, CustomFieldValue } from './types';

/**
 * Get custom field values for an entity
 */
export async function fetchCustomFieldValues(entityType: string, entityId: string): Promise<CustomFieldValue[]> {
  try {
    if (!entityId || !entityType) return [];

    const { data, error } = await supabase
      .from('custom_field_values')
      .select(`
        *,
        custom_fields:field_id (*)
      `)
      .eq('entity_type', entityType)
      .eq('entity_id', entityId);
    
    if (error) throw error;
    
    // Convert to CustomFieldValue type
    const typedValues: CustomFieldValue[] = data?.map(item => ({
      id: item.id,
      field_id: item.field_id,
      entity_id: item.entity_id,
      entity_type: item.entity_type,
      value: item.value,
      created_at: item.created_at,
      updated_at: item.updated_at,
      custom_fields: item.custom_fields as unknown as CustomField
    })) || [];
    
    return typedValues;
  } catch (err) {
    console.error('Error fetching custom field values:', err);
    throw err;
  }
}

/**
 * Save custom field values for an entity
 */
export async function saveEntityCustomFieldValues(
  entityType: string, 
  entityId: string, 
  values: Record<string, any>,
  customFields: CustomField[]
): Promise<boolean> {
  try {
    if (!customFields || customFields.length === 0) return false;
    
    // Prepare upsert array for all fields
    const upsertArray = customFields.map(field => {
      const value = values[field.field_key];
      
      return {
        entity_type: entityType,
        entity_id: entityId,
        field_id: field.id,
        value: value !== undefined ? value : null
      };
    });
    
    // Get existing values
    const { data: existingValues } = await supabase
      .from('custom_field_values')
      .select('id, field_id')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId);
    
    // Add IDs to upsert array if values already exist
    if (existingValues && existingValues.length > 0) {
      for (const item of upsertArray) {
        const existing = existingValues.find(ev => ev.field_id === item.field_id);
        if (existing && existing.id) {
          (item as any).id = existing.id;
        }
      }
    }
    
    // Perform upsert
    const { error } = await supabase
      .from('custom_field_values')
      .upsert(upsertArray);
    
    if (error) throw error;
    
    return true;
  } catch (err) {
    console.error('Error saving custom field values:', err);
    throw err;
  }
}

/**
 * Hook for managing custom field values
 */
export function useCustomFieldValues() {
  const getValues = async (entityType: string, entityId: string): Promise<CustomFieldValue[]> => {
    return fetchCustomFieldValues(entityType, entityId);
  };

  const saveValues = async (
    entityType: string, 
    entityId: string, 
    values: Record<string, any>,
    customFields: CustomField[]
  ): Promise<boolean> => {
    return saveEntityCustomFieldValues(entityType, entityId, values, customFields);
  };

  return {
    getCustomFieldValues: getValues,
    saveCustomFieldValues: saveValues
  };
}
