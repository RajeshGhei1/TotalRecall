
import { supabase } from '@/integrations/supabase/client';
import { CustomField, CustomFieldValue } from '../types';

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
