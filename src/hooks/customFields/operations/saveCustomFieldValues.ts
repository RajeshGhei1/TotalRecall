
import { supabase } from '@/integrations/supabase/client';
import { CustomField } from '../types';

/**
 * Save custom field values for an entity
 */
export async function saveCustomFieldValues(
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
          (item as unknown).id = existing.id;
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
