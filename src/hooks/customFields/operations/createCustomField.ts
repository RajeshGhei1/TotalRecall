
import { supabase } from '@/integrations/supabase/client';
import { FieldFormValues } from '../types';

/**
 * Creates a new custom field
 */
export async function createCustomField(values: FieldFormValues & { 
  fieldKey?: string, 
  tenantId?: string | null 
}) {
  console.log('Creating custom field with values:', values);
  
  // Ensure name is provided since it's required
  if (!values.name) {
    throw new Error('Field name is required');
  }

  // Generate field_key from name or label if not provided
  const field_key = values.fieldKey || 
                   values.label?.toLowerCase().replace(/\s+/g, '_') || 
                   values.name.toLowerCase().replace(/\s+/g, '_');

  try {
    const { data, error } = await supabase
      .from('custom_fields')
      .insert({
        name: values.name,
        field_key: field_key,
        field_type: values.fieldType,
        description: values.info,
        required: !!values.required,
        applicable_forms: values.forms || [],
        options: values.options ? { options: values.options } : null,
        tenant_id: values.tenantId === 'global' ? null : values.tenantId,
        sort_order: 0 // Default sort_order for new fields
      })
      .select();

    if (error) {
      console.error('Error creating custom field:', error);
      throw error;
    }

    console.log('Created custom field:', data);
    return data?.[0];
  } catch (error) {
    console.error('Exception creating custom field:', error);
    throw error;
  }
}
