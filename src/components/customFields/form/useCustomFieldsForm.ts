
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomField } from '@/hooks/customFields/types';
import { toast } from '@/hooks/use-toast';
import { arrayMove } from '@dnd-kit/sortable';
import { useCustomFieldsHook } from '@/hooks/customFields/useCustomFieldsHook';
import { UseFormReturn } from 'react-hook-form';
import { CustomFormData } from '@/types/common';

export interface UseCustomFieldsFormProps {
  entityType: string;
  entityId?: string;
  tenantId?: string;
  formContext?: string;
  externalForm?: UseFormReturn<CustomFormData>;
  onSubmit?: (data: CustomFormData) => void;
}

export interface UseCustomFieldsFormReturn {
  form: UseFormReturn<CustomFormData>;
  customFields: CustomField[];
  orderedFields: CustomField[];
  setOrderedFields: React.Dispatch<React.SetStateAction<CustomField[]>>;
  isLoading: boolean;
  fieldValues: CustomFormData;
  handleSubmit: (data: CustomFormData) => Promise<void>;
  handleDragEnd: (oldIndex: number, newIndex: number) => void;
}

export const useCustomFieldsForm = ({
  entityType,
  entityId,
  tenantId,
  formContext,
  externalForm,
  onSubmit,
}: UseCustomFieldsFormProps): UseCustomFieldsFormReturn => {
  const [fieldValues, setFieldValues] = React.useState<CustomFormData>({});
  const [orderedFields, setOrderedFields] = React.useState<CustomField[]>([]);
  
  // Get custom fields and values
  const { 
    customFields,
    isLoading,
    getCustomFieldValues,
    saveCustomFieldValues,
    updateFieldOrder,
  } = useCustomFieldsHook(tenantId, { formContext });
  
  // Update ordered fields when customFields change
  React.useEffect(() => {
    if (customFields) {
      setOrderedFields(customFields);
    }
  }, [customFields]);
  
  // Create form schema dynamically based on fields
  const createFormSchema = (fields: CustomField[]) => {
    const schema: Record<string, z.ZodTypeAny> = {};
    
    fields?.forEach(field => {
      let fieldSchema: z.ZodTypeAny;
      
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
          fieldSchema = z.unknown();
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
        }, {} as CustomFormData);
        
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

  // Create form with dynamic validation schema
  const formSchema = createFormSchema(orderedFields || []);
  const internalForm = !externalForm ? useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: fieldValues,
  }) : undefined;
  
  const form = externalForm || internalForm;

  // Handle form submission
  const handleSubmit = async (data: CustomFormData) => {
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
  const handleDragEnd = (oldIndex: number, newIndex: number) => {
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
  };

  return {
    form: form as UseFormReturn<CustomFormData>,
    customFields,
    orderedFields,
    setOrderedFields,
    isLoading,
    fieldValues,
    handleSubmit,
    handleDragEnd,
  };
};
