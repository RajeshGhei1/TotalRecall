
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { useCustomFieldsMutations } from '@/hooks/customFields/useCustomFieldsMutations';
import { useCustomFieldsQuery } from '@/hooks/customFields/useCustomFieldsQuery';
import { FieldFormValues } from '../form/CustomFieldForm';
import { validateCustomField } from '../form/validation/CustomFieldValidation';
import CustomFieldList from '../CustomFieldList';
import CustomFieldForm from '../form/CustomFieldForm';
import { toast } from 'sonner';
import { CustomField } from '@/hooks/customFields/types';
import CustomFieldsHeader from './CustomFieldsHeader';
import { ErrorBoundary } from '@/components/ui/error-boundary';

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
      // Validate the field data using our comprehensive validation
      const validatedData = validateCustomField(values);
      
      // Generate a field_key from the label if not provided
      const fieldKey = validatedData.label ? 
        validatedData.label.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') : 
        validatedData.name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
      
      // Process options to ensure they have valid structure
      const processedOptions = validatedData.options ? 
        validatedData.options.map(opt => ({
          value: opt.value.trim(),
          label: opt.label.trim()
        })) : 
        [];
      
      // Log submission data for debugging
      console.log('Submitting validated custom field:', {
        ...validatedData,
        fieldKey,
        options: processedOptions,
        tenantId: tenantId === 'global' ? null : tenantId
      });
      
      // Create the field with properly formatted data
      const fieldData = {
        ...validatedData,
        fieldKey: fieldKey,
        options: processedOptions,
        tenantId: tenantId === 'global' ? null : tenantId
      };
      
      await createField(fieldData, tenantId === 'global' ? undefined : tenantId);
      
      setIsDialogOpen(false);
      await refetch();
      
      toast.success('Custom field created', {
        description: `Field "${validatedData.name}" has been created successfully.`
      });
    } catch (error: any) {
      console.error('Error creating field:', error);
      toast.error('Validation Error', {
        description: error.message || 'Failed to create custom field due to validation errors.'
      });
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this field? This action cannot be undone.');
    if (confirmDelete) {
      try {
        await deleteField(id);
        await refetch();
        
        toast.success('Custom field deleted', {
          description: 'The field has been deleted successfully.'
        });
      } catch (error: any) {
        console.error('Error deleting field:', error);
        toast.error('Error', {
          description: `Failed to delete custom field: ${error.message || 'Please try again.'}`
        });
      }
    }
  };

  const handleReorder = async (reorderedFields: CustomField[]) => {
    const fieldsWithOrder = reorderedFields.map((field, index) => ({
      ...field,
      sort_order: index
    }));
    
    try {
      await updateFieldsOrder(fieldsWithOrder, tenantId === 'global' ? undefined : tenantId);
      await refetch();
    } catch (error: any) {
      console.error('Error reordering fields:', error);
      toast.error('Error', {
        description: `Failed to reorder custom fields: ${error.message || 'Please try again.'}`
      });
    }
  };
  
  return (
    <ErrorBoundary>
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
          <ErrorBoundary>
            <CustomFieldList
              fields={fields}
              isLoading={isLoading}
              onDelete={handleDelete}
              isDeleting={isDeleting}
              onReorder={handleReorder}
              canReorder={true}
            />
          </ErrorBoundary>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
            <ErrorBoundary>
              <CustomFieldForm
                onSubmit={handleSubmit}
                onCancel={() => setIsDialogOpen(false)}
                isSubmitting={isCreating || isUpdating}
                tenantId={tenantId || 'global'}
              />
            </ErrorBoundary>
          </DialogContent>
        </Dialog>
      </div>
    </ErrorBoundary>
  );
}

export default CustomFieldsManager;
