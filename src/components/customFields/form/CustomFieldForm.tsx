
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

export const availableForms = [
  { value: 'talent_form', label: 'Talent Profile' },
  { value: 'job_form', label: 'Job Listing' },
  { value: 'company_form', label: 'Company Profile' },
  { value: 'tenants_form', label: 'Tenant Settings' },
  { value: 'application_form', label: 'Job Application' },
  { value: 'candidate_form', label: 'Candidate Profile' },
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
            {fieldType === 'text' && <TextFieldInput form={form} />}
            {fieldType === 'textarea' && <TextareaInput form={form} />}
            {fieldType === 'dropdown' && <DropdownFieldInput form={form} />}
            {fieldType === 'number' && <NumberFieldInput form={form} />}
            {fieldType === 'boolean' && <BooleanFieldInput form={form} />}
            {fieldType === 'date' && <DateFieldInput form={form} />}
            
            {/* Form Applicability Selector */}
            <FormApplicabilitySelector 
              form={form} 
              availableForms={availableForms} 
            />
          </div>
          
          <FormFooter onCancel={onCancel} isSubmitting={isSubmitting} />
        </form>
      </Form>
    </Card>
  );
};

export default CustomFieldForm;
