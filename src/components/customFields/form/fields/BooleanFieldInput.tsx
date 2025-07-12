
import React from 'react';
import { CustomField } from '@/hooks/customFields/types';
import { Checkbox } from '@/components/ui/checkbox';
import {
  FormField,
  FormItem,
  FormDescription,
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { CustomFormData } from '@/types/common';

interface BooleanFieldInputProps {
  field: CustomField;
  form: UseFormReturn<CustomFormData>;
  fieldName: string;
}

const BooleanFieldInput: React.FC<BooleanFieldInputProps> = ({ field, form, fieldName }) => {
  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field: formField }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <Checkbox
            checked={Boolean(formField.value)}
            onCheckedChange={formField.onChange}
            id={fieldName}
          />
          <div className="space-y-1 leading-none">
            <label
              htmlFor={fieldName}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {field.name}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </label>
            {field.description && (
              <FormDescription>{field.description}</FormDescription>
            )}
          </div>
        </FormItem>
      )}
    />
  );
};

export default BooleanFieldInput;
