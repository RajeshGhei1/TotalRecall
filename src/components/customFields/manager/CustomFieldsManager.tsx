
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { useCustomFieldsMutations } from '@/hooks/customFields/useCustomFieldsMutations';
import { useCustomFieldsQuery } from '@/hooks/customFields/useCustomFieldsQuery';
import { FieldFormValues } from '../form/CustomFieldForm';
import CustomFieldList from '../CustomFieldList';
import CustomFieldForm from '../form/CustomFieldForm';
import { toast } from '@/hooks/use-toast';
import { CustomField } from '@/hooks/customFields/types';

interface CustomFieldsManagerProps {
  tenantId?: string;
  formContext?: string;
  title?: string;
  description?: string;
}

export const CustomFieldsManager: React.FC<CustomFieldsManagerProps> = ({
  tenantId,
  formContext,
  title = 'Custom Fields',
  description = 'Configure custom fields to collect additional information.'
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { 
    fields, 
    isLoading, 
    refetch 
  } = useCustomFieldsQuery(tenantId, formContext);
  
  const { 
    createField, 
    updateField, 
    deleteField, 
    updateFieldsOrder, 
    isCreating, 
    isUpdating, 
    isDeleting 
  } = useCustomFieldsMutations();

  const handleSubmit = async (values: FieldFormValues) => {
    try {
      // Ensure name is provided
      if (!values.name) {
        toast({
          title: 'Validation Error',
          description: 'Field name is required',
          variant: 'destructive',
        });
        return;
      }
      
      // Fix the options type to ensure they have required properties
      const processedOptions = values.options ? 
        values.options.map(opt => ({
          value: opt.value || '',  // Ensure value is never undefined
          label: opt.label || ''   // Ensure label is never undefined
        })) : 
        [];
      
      await createField({
        name: values.name,
        label: values.label,
        fieldType: values.fieldType,
        required: values.required,
        placeholder: values.placeholder,
        defaultValue: values.defaultValue,
        minLength: values.minLength,
        maxLength: values.maxLength,
        options: processedOptions, // Use the processed options
        min: values.min,
        max: values.max,
        step: values.step,
        forms: values.forms,
        info: values.info,
        validation: values.validation
      }, tenantId);
      
      setIsDialogOpen(false);
      await refetch();
      
      toast({
        title: 'Custom field created',
        description: `Field "${values.name}" has been created successfully.`
      });
    } catch (error) {
      console.error('Error creating field:', error);
      toast({
        title: 'Error',
        description: 'Failed to create custom field. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this field? This action cannot be undone.');
    if (confirmDelete) {
      try {
        await deleteField(id);
        await refetch();
        
        toast({
          title: 'Custom field deleted',
          description: 'The field has been deleted successfully.'
        });
      } catch (error) {
        console.error('Error deleting field:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete custom field. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleReorder = async (reorderedFields: CustomField[]) => {
    // Map the fields to include the sort_order property
    const fieldsWithOrder = reorderedFields.map((field, index) => ({
      ...field,
      sort_order: index
    }));
    
    try {
      await updateFieldsOrder(fieldsWithOrder, tenantId);
      await refetch();
    } catch (error) {
      console.error('Error reordering fields:', error);
      toast({
        title: 'Error',
        description: 'Failed to reorder custom fields. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
        <Button 
          onClick={() => setIsDialogOpen(true)}
          disabled={isLoading}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Custom Field
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <CustomFieldList
          fields={fields}
          isLoading={isLoading}
          onDelete={handleDelete}
          isDeleting={isDeleting}
          onReorder={handleReorder}
          canReorder={true}
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
          <CustomFieldForm
            onSubmit={handleSubmit}
            onCancel={() => setIsDialogOpen(false)}
            isSubmitting={isCreating || isUpdating}
            tenantId={tenantId || 'global'}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CustomFieldsManager;
