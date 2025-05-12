
import React from 'react';
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormDescription,
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { FieldFormValues } from '../CustomFieldForm';

interface RequiredFieldCheckboxProps {
  form: UseFormReturn<FieldFormValues>;
}

const RequiredFieldCheckbox: React.FC<RequiredFieldCheckboxProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="required"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <FormControl>
            <input
              type="checkbox"
              checked={field.value}
              onChange={field.onChange}
              className="h-4 w-4 rounded border-gray-300"
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>Required Field</FormLabel>
            <FormDescription>
              Make this field mandatory in forms
            </FormDescription>
          </div>
        </FormItem>
      )}
    />
  );
};

export default RequiredFieldCheckbox;
