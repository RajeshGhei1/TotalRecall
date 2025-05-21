
import { supabase } from '@/integrations/supabase/client';

/**
 * Deletes an existing custom field
 */
export async function deleteCustomField(id: string) {
  // First delete any values associated with this field
  const { error: valuesError } = await supabase
    .from('custom_field_values')
    .delete()
    .eq('field_id', id);

  if (valuesError) {
    console.error('Error deleting custom field values:', valuesError);
    throw valuesError;
  }

  // Then delete the field itself
  const { data, error } = await supabase
    .from('custom_fields')
    .delete()
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error deleting custom field:', error);
    throw error;
  }

  return data?.[0];
}
