
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { CustomField } from './types';

/**
 * Update the order of custom fields
 */
export async function updateFieldOrderInDatabase(
  fields: CustomField[],
  tenantId?: string
): Promise<boolean> {
  if (!fields || fields.length === 0) return false;
  
  try {
    // Prepare update array with updated sort order and all required fields
    const updateArray = fields.map((field, index) => ({
      id: field.id,
      sort_order: index,
      name: field.name,
      field_key: field.field_key,
      field_type: field.field_type
    }));
    
    // Update fields in database
    const { error } = await supabase
      .from('custom_fields')
      .upsert(updateArray, { onConflict: 'id' });
    
    if (error) throw error;
    
    return true;
  } catch (err) {
    console.error('Error updating field order:', err);
    throw err;
  }
}

/**
 * Hook for managing custom field order
 */
export function useFieldOrder() {
  /**
   * Update the order of fields
   */
  const updateFieldOrder = async (
    fields: CustomField[],
    tenantId?: string,
    showToast: boolean = true
  ): Promise<boolean> => {
    try {
      const result = await updateFieldOrderInDatabase(fields, tenantId);
      
      if (showToast) {
        toast({
          title: 'Field order updated',
          description: 'The custom fields order has been saved successfully.',
        });
      }
      
      return result;
    } catch (err) {
      console.error('Error updating field order:', err);
      
      if (showToast) {
        toast({
          title: 'Error',
          description: 'Failed to update field order. Please try again.',
          variant: 'destructive',
        });
      }
      
      throw err;
    }
  };

  return { updateFieldOrder };
}
