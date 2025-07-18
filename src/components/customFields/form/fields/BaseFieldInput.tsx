
import React from 'react';
import { CustomField } from '@/hooks/customFields/types';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage 
} from '@/components/ui/form';
import { UseFormReturn, ControllerRenderProps } from 'react-hook-form';
import { CustomFormData } from '@/types/common';

export interface BaseFieldInputProps {
  field: CustomField;
  form: UseFormReturn<CustomFormData>;
  fieldName: string;
  children: (formField: ControllerRenderProps<CustomFormData, string>) => React.ReactNode;
}

const BaseFieldInput: React.FC<BaseFieldInputProps> = ({ 
  field, 
  form, 
  fieldName,
  children 
}) => {
  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field: formField }) => (
        <FormItem>
          <FormLabel>
            {field.name}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <FormControl>
            {children(formField)}
          </FormControl>
          {field.description && <FormDescription>{field.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default BaseFieldInput;
