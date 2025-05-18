
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { Card } from '@/components/ui/card';
import FormHeader from './FormHeader';
import FormFooter from './FormFooter';
import BasicFieldInfo from './fields/BasicFieldInfo';
import RequiredFieldCheckbox from './fields/RequiredFieldCheckbox';
import FormTypeSelect from './fields/FormTypeSelect';
import TextFieldInput from './fields/TextFieldInput';
import TextareaInput from './fields/TextareaInput';
import DropdownFieldInput from './fields/DropdownFieldInput';
import NumberFieldInput from './fields/NumberFieldInput';
import BooleanFieldInput from './fields/BooleanFieldInput';
import DateFieldInput from './fields/DateFieldInput';
import FormApplicabilitySelector from './fields/FormApplicabilitySelector';
import { CustomField } from '@/hooks/customFields/types';

// Schema for the form
export const customFieldSchema = z.object({
  name: z.string().min(1, "Name is required"),
  label: z.string().min(1, "Label is required"),
  fieldType: z.enum(['text', 'textarea', 'dropdown', 'number', 'boolean', 'date']),
  required: z.boolean().default(false),
  placeholder: z.string().optional(),
  defaultValue: z.string().optional(),
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  options: z.array(z.object({
    value: z.string(),
    label: z.string()
  })).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.string().optional(),
  forms: z.array(z.string()).default([]),
  info: z.string().optional(),
  validation: z.string().optional(),
});

export type FieldFormValues = z.infer<typeof customFieldSchema>;

// Define available forms for the application
export const availableForms = [
  { id: 'talent_form', label: 'Talent Profile' },
  { id: 'job_form', label: 'Job Listing' },
  { id: 'company_form', label: 'Company Profile' },
  { id: 'tenants_form', label: 'Tenant Settings' },
  { id: 'application_form', label: 'Job Application' },
  { id: 'candidate_form', label: 'Candidate Profile' },
];

interface CustomFieldFormProps {
  onSubmit: (values: FieldFormValues) => void;
  onCancel: () => void;
  initialValues?: Partial<FieldFormValues>;
  isSubmitting?: boolean;
  tenantId: string;
}

const CustomFieldForm: React.FC<CustomFieldFormProps> = ({
  onSubmit,
  onCancel,
  initialValues,
  isSubmitting = false,
  tenantId
}) => {
  console.log("Rendering CustomFieldForm with initialValues:", initialValues);
  
  const defaultValues: Partial<FieldFormValues> = {
    name: '',
    label: '',
    fieldType: 'text',
    required: false,
    placeholder: '',
    defaultValue: '',
    forms: [],
    ...initialValues
  };

  const form = useForm<FieldFormValues>({
    resolver: zodResolver(customFieldSchema),
    defaultValues,
  });
  const fieldType = form.watch('fieldType');

  const handleSubmit = (values: FieldFormValues) => {
    console.log("Form submitted with values:", values);
    onSubmit(values);
  };

  // Define a complete dummy field for the field components to use during form creation
  // This ensures all required properties of CustomField are present
  const dummyField: CustomField = {
    id: 'new-field',
    tenant_id: tenantId,
    name: form.watch('name') || 'New Field',
    field_key: (form.watch('name') || 'new_field').toLowerCase().replace(/\s+/g, '_'),
    field_type: fieldType,
    required: form.watch('required'),
    description: form.watch('info'),
    options: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <FormHeader />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="p-6 space-y-6">
            <BasicFieldInfo form={form} />
            <RequiredFieldCheckbox form={form} />
            <FormTypeSelect form={form} />

            {/* Conditional Fields based on fieldType */}
            {fieldType === 'text' && <TextFieldInput field={dummyField} form={form} fieldName="placeholder" />}
            {fieldType === 'textarea' && <TextareaInput field={dummyField} form={form} fieldName="placeholder" />}
            {fieldType === 'dropdown' && <DropdownFieldInput field={dummyField} form={form} fieldName="options" />}
            {fieldType === 'number' && <NumberFieldInput field={dummyField} form={form} fieldName="defaultValue" />}
            {fieldType === 'boolean' && <BooleanFieldInput field={dummyField} form={form} fieldName="defaultValue" />}
            {fieldType === 'date' && <DateFieldInput field={dummyField} form={form} fieldName="defaultValue" />}
            
            {/* Form Applicability Selector */}
            <FormApplicabilitySelector 
              form={form} 
              availableForms={availableForms}
            />
          </div>
          
          <FormFooter form={form} onCancel={onCancel} isSubmitting={isSubmitting} />
        </form>
      </Form>
    </Card>
  );
};

export default CustomFieldForm;
