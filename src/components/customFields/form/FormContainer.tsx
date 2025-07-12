
import React from 'react';
import { Form } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { CustomFormData } from '@/types/common';

interface FormContainerProps {
  form: UseFormReturn<CustomFormData>;
  onSubmit: (data: CustomFormData) => void;
  children: React.ReactNode;
}

const FormContainer: React.FC<FormContainerProps> = ({ 
  form, 
  onSubmit, 
  children 
}) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {children}
      </form>
    </Form>
  );
};

export default FormContainer;
