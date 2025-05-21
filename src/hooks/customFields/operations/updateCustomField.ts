
import { supabase } from '@/integrations/supabase/client';
import { CustomField } from '../types';

/**
 * Updates an existing custom field
 */
export async function updateCustomField(id: string, values: Partial<CustomField>) {
  const { data, error } = await supabase
    .from('custom_fields')
    .update(values)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating custom field:', error);
    throw error;
  }

  return data?.[0];
}
