import { supabase } from '@/integrations/supabase/client';
import { CustomField } from './types';

/**
 * Fetches custom fields for a given tenant
 */
export async function fetchCustomFields(tenantId: string): Promise<CustomField[]> {
  console.log(`Starting custom fields query for tenant: ${tenantId}`);
  
  try {
    const { data, error } = await supabase
      .from('custom_fields')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('name');

    if (error) {
      // Special handling for global tenant
      if (tenantId === 'global' && error.code === '22P02') {
        console.log('Using alternative query for global tenant');
        
        // For global tenant, get fields where tenant_id is null or 'global'
        const { data: globalData, error: globalError } = await supabase
          .from('custom_fields')
          .select('*')
          .is('tenant_id', null)
          .order('name');
          
        if (globalError) {
          console.error('Error fetching global custom fields:', globalError);
          throw globalError;
        }
        
        console.log(`Retrieved ${globalData?.length || 0} global custom fields`);
        return globalData as CustomField[];
      }
      
      console.error('Error fetching custom fields:', error);
      throw error;
    }
    
    console.log(`Retrieved ${data?.length || 0} custom fields for tenant: ${tenantId}`);
    return data as CustomField[];
  } catch (error) {
    console.error('Error in fetchCustomFields:', error);
    throw error;
  }
}

/**
 * Filters custom fields based on the form context
 */
export function filterFieldsByFormContext(
  fields: CustomField[], 
  formContext?: string
): CustomField[] {
  if (!formContext) return fields;
  
  return fields.filter(field => {
    // If applicable_forms is empty array or null, field applies to all forms
    if (!field.applicable_forms || 
        (Array.isArray(field.applicable_forms) && field.applicable_forms.length === 0)) {
      return true;
    }
    // Otherwise, check if this form is in the applicable_forms array
    return Array.isArray(field.applicable_forms) && field.applicable_forms.includes(formContext);
  });
}

/**
 * Fetches custom field values for a specific entity
 */
export async function fetchCustomFieldValues(
  entityType: string, 
  entityId: string
): Promise<any[]> {
  if (!entityId || !entityType) return [];

  console.log(`Getting custom field values for ${entityType}:${entityId}`);

  try {
    const { data, error } = await supabase
      .from('custom_field_values')
      .select(`
        id, 
        value,
        field_id,
        custom_fields(id, name, field_key, field_type, required, options, applicable_forms)
      `)
      .eq('entity_type', entityType)
      .eq('entity_id', entityId);

    if (error) {
      console.error('Error fetching custom field values:', error);
      throw error;
    }
    
    console.log(`Retrieved ${data?.length || 0} custom field values for ${entityType}:${entityId}`, data);
    return data;
  } catch (error) {
    console.error('Error in fetchCustomFieldValues:', error);
    return [];
  }
}
