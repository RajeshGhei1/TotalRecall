
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CustomField, FieldFormValues } from './types';
import { createCustomField, updateCustomField, deleteCustomField } from './fieldOperations';

export function useCustomFieldsMutations() {
  const queryClient = useQueryClient();
  
  // Create field mutation
  const createMutation = useMutation({
    mutationFn: async ({ values, tenantId }: { 
      values: FieldFormValues & { fieldKey?: string; tenantId?: string }; 
      tenantId?: string 
    }) => {
      console.log('Mutation executing with values:', values, 'tenantId:', tenantId);
      return await createCustomField({ ...values, tenantId });
    },
    onSuccess: (data) => {
      console.log('Mutation succeeded:', data);
      queryClient.invalidateQueries({ queryKey: ['custom-fields'] });
    },
    onError: (error) => {
      console.error('Mutation error:', error);
    }
  });
  
  // Update field mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Partial<CustomField> }) => {
      return await updateCustomField(id, values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-fields'] });
    }
  });
  
  // Delete field mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await deleteCustomField(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-fields'] });
    }
  });
  
  // Update field order mutation
  const updateOrderMutation = useMutation({
    mutationFn: async ({ 
      fields, 
      tenantId 
    }: { 
      fields: CustomField[]; 
      tenantId?: string 
    }) => {
      // Prepare updates - include all required fields
      const updates = fields.map((field, index) => ({
        id: field.id,
        sort_order: index,
        name: field.name,
        field_key: field.field_key,
        field_type: field.field_type
      }));
      
      console.log('Updating field order with:', updates);
      
      // Update all fields in one go
      const { data, error } = await supabase
        .from('custom_fields')
        .upsert(updates, { onConflict: 'id' });
      
      if (error) throw error;
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-fields'] });
    }
  });
  
  // Convenience functions with proper typing
  const createField = (
    values: FieldFormValues & { fieldKey?: string; tenantId?: string }, 
    tenantId?: string
  ) => {
    // Ensure name is required
    if (!values.name) {
      throw new Error('Field name is required');
    }
    return createMutation.mutateAsync({ values, tenantId });
  };
  
  const updateField = (id: string, values: Partial<CustomField>) => {
    return updateMutation.mutateAsync({ id, values });
  };
  
  const deleteField = (id: string) => {
    return deleteMutation.mutateAsync(id);
  };
  
  const updateFieldsOrder = (fields: CustomField[], tenantId?: string) => {
    return updateOrderMutation.mutateAsync({ fields, tenantId });
  };

  return {
    createField,
    updateField,
    deleteField,
    updateFieldsOrder,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isReordering: updateOrderMutation.isPending
  };
}
