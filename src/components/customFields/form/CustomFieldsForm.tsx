
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import RenderCustomField from './RenderCustomField';
import FormHeader from './FormHeader';
import FormFooter from './FormFooter';
import { useCustomFields } from '@/hooks/useCustomFields';
import { CustomField } from '@/hooks/customFields/types';
import { UseFormReturn } from 'react-hook-form';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import SortableFormField from './SortableFormField';

interface CustomFieldsFormProps {
  entityType: string;
  entityId?: string;
  title?: string;
  description?: string;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
  tenantId?: string;
  formContext?: string;
  form?: UseFormReturn<any>;
  enableDragAndDrop?: boolean;
}

const CustomFieldsForm = ({
  entityType,
  entityId,
  title = 'Custom Fields',
  description,
  onSubmit,
  onCancel,
  tenantId,
  formContext,
  form: externalForm,
  enableDragAndDrop = false,
}: CustomFieldsFormProps) => {
  // Get custom fields and values for this entity type/id
  const { 
    customFields,
    isLoading,
    getCustomFieldValues,
    saveCustomFieldValues,
    updateFieldOrder,
  } = useCustomFields(tenantId, { formContext });
  
  const [fieldValues, setFieldValues] = React.useState<Record<string, any>>({});
  const [orderedFields, setOrderedFields] = React.useState<CustomField[]>([]);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // Fetch values if we have an entityId
  React.useEffect(() => {
    const fetchValues = async () => {
      if (entityId && entityType) {
        const values = await getCustomFieldValues(entityType, entityId);
        
        // Convert the array of values to an object keyed by field_key
        const valuesObj = values.reduce((acc, item) => {
          const fieldKey = item.custom_fields?.field_key;
          if (fieldKey) {
            acc[fieldKey] = item.value;
          }
          return acc;
        }, {} as Record<string, any>);
        
        setFieldValues(valuesObj);
        
        // If using external form, update it with custom field values
        if (externalForm) {
          const currentValues = externalForm.getValues();
          externalForm.reset({ ...currentValues, ...valuesObj });
        } else if (internalForm) {
          internalForm.reset(valuesObj);
        }
      }
    };
    
    fetchValues();
  }, [entityId, entityType, getCustomFieldValues]);

  // Update ordered fields when customFields change
  React.useEffect(() => {
    if (customFields) {
      setOrderedFields(customFields);
    }
  }, [customFields]);

  // Create form schema dynamically based on fields
  const createFormSchema = (fields: CustomField[]) => {
    const schema: Record<string, any> = {};
    
    fields?.forEach(field => {
      let fieldSchema;
      
      switch (field.field_type) {
        case 'text':
          fieldSchema = z.string().optional();
          break;
        case 'textarea':
          fieldSchema = z.string().optional();
          break;
        case 'number':
          fieldSchema = z.number().optional().nullable();
          break;
        case 'date':
          fieldSchema = z.date().optional().nullable();
          break;
        case 'boolean':
          fieldSchema = z.boolean().optional();
          break;
        case 'dropdown':
          fieldSchema = z.string().optional();
          break;
        default:
          fieldSchema = z.any();
      }
      
      // Make required fields required
      if (field.required) {
        if (field.field_type === 'number') {
          fieldSchema = z.number({
            required_error: `${field.name} is required`,
            invalid_type_error: `${field.name} must be a number`,
          });
        } else if (field.field_type === 'date') {
          fieldSchema = z.date({
            required_error: `${field.name} is required`,
            invalid_type_error: `${field.name} must be a valid date`,
          });
        } else {
          fieldSchema = z.string().min(1, { message: `${field.name} is required` });
        }
      }
      
      // Add to schema
      schema[field.field_key] = fieldSchema;
    });
    
    return z.object(schema);
  };

  // Create form with dynamic validation schema
  const formSchema = createFormSchema(orderedFields || []);
  const internalForm = !externalForm ? useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: fieldValues,
  }) : undefined;
  
  const form = externalForm || internalForm;

  // Handle form submission
  const handleSubmit = async (data: any) => {
    console.log('Form submitted with data:', data);
    try {
      if (entityId) {
        await saveCustomFieldValues(entityType, entityId, data);
        toast({
          title: 'Custom fields updated',
          description: 'Your changes have been saved successfully.',
        });
      }
      
      if (onSubmit) {
        onSubmit(data);
      }
    } catch (error) {
      console.error('Error saving custom fields:', error);
      toast({
        title: 'Error',
        description: 'Failed to save custom fields. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Handle field reordering with drag and drop
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = orderedFields.findIndex(field => field.id === active.id);
      const newIndex = orderedFields.findIndex(field => field.id === over.id);
      
      // Reorder the array
      const newOrderedFields = arrayMove(orderedFields, oldIndex, newIndex);
      setOrderedFields(newOrderedFields);
      
      // Persist the new order if updateFieldOrder is available
      if (updateFieldOrder && tenantId) {
        // Add sort_order to each field based on its position
        const fieldsWithOrder = newOrderedFields.map((field, index) => ({
          ...field,
          sort_order: index
        }));
        
        updateFieldOrder(fieldsWithOrder, tenantId, formContext)
          .catch(error => {
            console.error('Failed to update field order:', error);
            toast({
              title: 'Error',
              description: 'Failed to save field order. Please try again.',
              variant: 'destructive',
            });
          });
      }
    }
  };

  // Return loading state or form
  if (isLoading) {
    return <div className="flex justify-center p-8">Loading custom fields...</div>;
  }

  if (!form) {
    return <div>Form configuration error</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {(title || description) && (
          <div>
            {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
            {description && <p className="text-muted-foreground">{description}</p>}
          </div>
        )}
        
        {orderedFields && orderedFields.length > 0 ? (
          <div className="space-y-6">
            {enableDragAndDrop ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={orderedFields.map(field => field.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {orderedFields.map((field) => (
                    <SortableFormField
                      key={field.id}
                      field={field}
                      form={form}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            ) : (
              orderedFields.map((field) => (
                <RenderCustomField
                  key={field.field_key}
                  field={field}
                  form={form}
                />
              ))
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No custom fields found for this entity type.
          </div>
        )}
        
        {onCancel && (
          <div className="flex justify-end space-x-2 pt-4">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Save
            </button>
          </div>
        )}
      </form>
    </Form>
  );
};

export default CustomFieldsForm;
