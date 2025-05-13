
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import RenderCustomField from './RenderCustomField';
import FormHeader from './FormHeader';
import FormFooter from './FormFooter';
import { useCustomFields } from '@/hooks/useCustomFields';
import { CustomField } from '@/hooks/customFields/types';

interface CustomFieldsFormProps {
  entityType: string;
  entityId?: string;
  title?: string;
  description?: string;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

const CustomFieldsForm = ({
  entityType,
  entityId,
  title = 'Custom Fields',
  description,
  onSubmit,
  onCancel,
}: CustomFieldsFormProps) => {
  // Get custom fields and values for this entity type/id
  const { 
    fields,
    values,
    isLoading,
    saveCustomFieldValues,
  } = useCustomFields(entityType, entityId);

  // Create form schema dynamically based on fields
  const createFormSchema = (fields: CustomField[]) => {
    const schema: Record<string, any> = {};
    
    fields.forEach(field => {
      let fieldSchema;
      
      switch (field.field_type) {
        case 'text':
          fieldSchema = z.string();
          break;
        case 'textarea':
          fieldSchema = z.string();
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
  const formSchema = createFormSchema(fields || []);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: values || {},
  });

  // Handle form submission
  const handleSubmit = async (data: any) => {
    console.log('Form submitted with data:', data);
    try {
      if (entityId) {
        await saveCustomFieldValues(data);
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

  // Return loading state or form
  if (isLoading) {
    return <div className="flex justify-center p-8">Loading custom fields...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormHeader title={title} description={description} />
        
        {fields && fields.length > 0 ? (
          <div className="space-y-6">
            {fields.map((field) => (
              <RenderCustomField 
                key={field.field_key} 
                field={field} 
                form={form} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No custom fields found for this entity type.
          </div>
        )}
        
        <FormFooter form={form} onCancel={onCancel} />
      </form>
    </Form>
  );
};

export default CustomFieldsForm;
