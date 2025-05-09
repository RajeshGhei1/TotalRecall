
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CustomFieldForm, { FieldFormValues } from './customFields/CustomFieldForm';
import CustomFieldList from './customFields/CustomFieldList';

interface CustomField {
  id: string;
  tenant_id: string;
  name: string;
  field_key: string;
  field_type: string;
  required: boolean;
  options?: Record<string, any>;
  description?: string;
}

interface CustomFieldsManagerProps {
  tenantId: string;
}

const CustomFieldsManager: React.FC<CustomFieldsManagerProps> = ({ tenantId }) => {
  const [isAddingField, setIsAddingField] = useState(false);
  const queryClient = useQueryClient();

  // Fetch custom fields for this tenant
  const { data: customFields = [], isLoading } = useQuery({
    queryKey: ['customFields', tenantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('custom_fields')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('name');

      if (error) throw error;
      return data as CustomField[];
    },
  });

  // Add custom field mutation
  const addFieldMutation = useMutation({
    mutationFn: async (values: FieldFormValues) => {
      // Parse options if field type is dropdown
      let options = null;
      if (values.field_type === 'dropdown' && values.options) {
        try {
          // Convert comma-separated values to array of objects
          const optionsArray = values.options
            .split(',')
            .map(option => option.trim())
            .filter(option => option)
            .map(option => ({ label: option, value: option }));
          options = { options: optionsArray };
        } catch (err) {
          throw new Error('Invalid options format');
        }
      }

      const { data, error } = await supabase
        .from('custom_fields')
        .insert({
          tenant_id: tenantId,
          name: values.name,
          field_key: values.field_key,
          field_type: values.field_type,
          required: values.required,
          description: values.description,
          options: options,
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
      setIsAddingField(false);
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

  const handleAddField = (values: FieldFormValues) => {
    addFieldMutation.mutate(values);
  };

  const handleDeleteField = (fieldId: string) => {
    if (confirm('Are you sure you want to delete this custom field? All data associated with it will be lost.')) {
      deleteFieldMutation.mutate(fieldId);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Custom Fields</h3>
        <Button
          onClick={() => setIsAddingField(true)}
          disabled={isAddingField}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Custom Field
        </Button>
      </div>

      {isAddingField && (
        <CustomFieldForm
          onSubmit={handleAddField}
          onCancel={() => setIsAddingField(false)}
          isSubmitting={addFieldMutation.isPending}
        />
      )}

      <CustomFieldList
        fields={customFields}
        isLoading={isLoading}
        onDelete={handleDeleteField}
        isDeleting={deleteFieldMutation.isPending}
      />
    </div>
  );
};

export default CustomFieldsManager;
