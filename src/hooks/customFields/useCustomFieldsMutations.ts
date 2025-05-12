
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { FieldFormValues } from '@/components/customFields/CustomFieldForm';

export const useCustomFieldsMutations = (tenantId: string) => {
  const queryClient = useQueryClient();

  // Add custom field mutation
  const addFieldMutation = useMutation({
    mutationFn: async (values: FieldFormValues) => {
      // Parse options if field type is dropdown
      let options = null;
      if (values.fieldType === 'dropdown') {
        try {
          // Initialize options array
          let optionsArray: Array<{ label: string, value: string }> = [];
          
          if (Array.isArray(values.options)) {
            // Ensure each option has both label and value as non-optional
            optionsArray = values.options.map(option => ({
              label: option.label || option.value || '',
              value: option.value || option.label || ''
            }));
          } else if (typeof values.options === 'string') {
            // Process string options - adding type guard to ensure options is string
            optionsArray = values.options
              .split(',')
              .map(option => option.trim())
              .filter(option => option)
              .map(option => ({ label: option, value: option }));
          }
          options = { options: optionsArray };
        } catch (err) {
          console.error('Error parsing options:', err);
          throw new Error('Invalid options format');
        }
      }

      // Store the applicable forms array
      const applicable_forms = values.forms && values.forms.length > 0 
        ? values.forms 
        : [];

      const { data, error } = await supabase
        .from('custom_fields')
        .insert({
          tenant_id: tenantId,
          name: values.name,
          field_key: values.name.toLowerCase().replace(/\s+/g, '_'),
          field_type: values.fieldType,
          required: values.required,
          description: values.info,
          options: options,
          applicable_forms: applicable_forms,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Custom field created',
        description: 'The custom field has been created successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['customFields', tenantId] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create custom field: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Delete custom field mutation
  const deleteFieldMutation = useMutation({
    mutationFn: async (fieldId: string) => {
      // First delete any custom field values associated with this field
      const { error: valuesError } = await supabase
        .from('custom_field_values')
        .delete()
        .eq('field_id', fieldId);

      if (valuesError) throw valuesError;

      // Then delete the field itself
      const { error } = await supabase
        .from('custom_fields')
        .delete()
        .eq('id', fieldId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Custom field deleted',
        description: 'The custom field has been deleted successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['customFields', tenantId] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete custom field: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  return {
    addFieldMutation,
    deleteFieldMutation
  };
};
