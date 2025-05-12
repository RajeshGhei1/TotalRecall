
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import FormHeader from './FormHeader';
import BasicFieldInfo from './fields/BasicFieldInfo';
import FormTypeSelect from './fields/FormTypeSelect';
import OptionsInput from './fields/OptionsInput';
import FormApplicabilitySelector from './fields/FormApplicabilitySelector';
import RequiredFieldCheckbox from './fields/RequiredFieldCheckbox';
import FormFooter from './FormFooter';

// Define available forms in the system
export const availableForms = [
  { id: 'tenant_creation', label: 'Tenant Creation Form' },
  { id: 'tenant_edit', label: 'Tenant Edit Form' },
  { id: 'talent_profile', label: 'Talent Profile' },
  { id: 'company_details', label: 'Company Details' },
  { id: 'job_posting', label: 'Job Posting' },
];

const fieldSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  field_key: z
    .string()
    .min(2, { message: 'Field key must be at least 2 characters' })
    .regex(/^[a-zA-Z0-9_]+$/, { message: 'Field key can only contain letters, numbers and underscores' }),
  field_type: z.enum(['text', 'number', 'date', 'dropdown', 'boolean', 'textarea']),
  required: z.boolean().default(false),
  description: z.string().optional(),
  options: z.string().optional(),
  applicable_forms: z.array(z.string()).optional().default([]),
});

export type FieldFormValues = z.infer<typeof fieldSchema>;

interface CustomFieldFormProps {
  onSubmit: (values: FieldFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const CustomFieldForm: React.FC<CustomFieldFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const form = useForm<FieldFormValues>({
    resolver: zodResolver(fieldSchema),
    defaultValues: {
      name: '',
      field_key: '',
      field_type: 'text',
      required: false,
      description: '',
      options: '',
      applicable_forms: [],
    },
  });

  return (
    <Card>
      <FormHeader />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <BasicFieldInfo form={form} />
            <FormTypeSelect form={form} />
            
            {form.watch('field_type') === 'dropdown' && (
              <OptionsInput form={form} />
            )}
            
            <FormApplicabilitySelector form={form} />
            <RequiredFieldCheckbox form={form} />
          </CardContent>
          <FormFooter onCancel={onCancel} isSubmitting={isSubmitting} />
        </form>
      </Form>
    </Card>
  );
};

export default CustomFieldForm;
