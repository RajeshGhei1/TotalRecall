
import { supabase } from '@/integrations/supabase/client';
import { QueryClient } from '@tanstack/react-query';

/**
 * Saves custom field values for an entity
 */
export async function saveCustomFieldValues(
  queryClient: QueryClient,
  tenantId: string,
  entityType: string,
  entityId: string,
  values: Record<string, any>,
  formContext?: string
): Promise<void> {
  if (!entityId || !entityType) return;

  console.log(`Saving custom field values for ${entityType}:${entityId}`, values);

  try {
    // Handle special case for "global" tenant
    let query = supabase
      .from('custom_fields')
      .select('id, field_key, applicable_forms');
    
    // Adjust query based on tenant type
    if (tenantId === 'global') {
      query = query.is('tenant_id', null);
    } else {
      query = query.or(`tenant_id.is.null,tenant_id.eq.${tenantId}`);
    }
    
    // Get all custom fields
    const { data: fields, error: fieldsError } = await query;

    if (fieldsError) {
      console.error("Error fetching custom fields:", fieldsError);
      throw fieldsError;
    }
    
    // Get existing field values
    const { data: existingValues, error: existingError } = await supabase
      .from('custom_field_values')
      .select('id, field_id')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId);

    if (existingError) {
      console.error("Error fetching existing values:", existingError);
      throw existingError;
    }

    // Create a map of field_key to field_id and check form context if provided
    const fieldKeyToId = fields.reduce((acc, field) => {
      // If formContext is provided, only include fields applicable to this form
      if (formContext) {
        if (!field.applicable_forms || 
            (Array.isArray(field.applicable_forms) && field.applicable_forms.length === 0)) {
          // Field applies to all forms
          acc[field.field_key] = field.id;
        } else if (Array.isArray(field.applicable_forms) && field.applicable_forms.includes(formContext)) {
          // Field applies to this specific form
          acc[field.field_key] = field.id;
        }
      } else {
        // No form context filter, include all fields
        acc[field.field_key] = field.id;
      }
      return acc;
    }, {} as Record<string, string>);

    // Create a map of field_id to existing value id
    const fieldIdToValueId = existingValues.reduce((acc, val) => {
      acc[val.field_id] = val.id;
      return acc;
    }, {} as Record<string, string>);

    // Prepare upserts (update or insert)
    const upserts = [];

    // Go through all values
    for (const [fieldKey, value] of Object.entries(values)) {
      const fieldId = fieldKeyToId[fieldKey];
      if (!fieldId) {
        console.warn(`Field key ${fieldKey} not found in database or not applicable to the form context`);
        continue;  // Skip if field doesn't exist or not applicable to this form
      }

      const existingId = fieldIdToValueId[fieldId];
      
      console.log(`Processing field ${fieldKey} with value ${value}, existingId: ${existingId}`);

      upserts.push({
        id: existingId || undefined,
        field_id: fieldId,
        entity_type: entityType,
        entity_id: entityId,
        value: value
      });
    }

    if (upserts.length > 0) {
      console.log("Upserting custom field values:", upserts);
      const { error: upsertError, data } = await supabase
        .from('custom_field_values')
        .upsert(upserts)
        .select();

      if (upsertError) {
        console.error("Error upserting values:", upsertError);
        throw upsertError;
      }
      
      console.log("Upserted values:", data);
    } else {
      console.log("No custom field values to upsert");
    }
    
    // Invalidate queries
    queryClient.invalidateQueries({ queryKey: ['customFieldValues', entityType, entityId] });
  } catch (error) {
    console.error('Error saving custom field values:', error);
    throw error;
  }
}
