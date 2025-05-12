
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
import { Checkbox } from '@/components/ui/checkbox';

interface BooleanFieldInputProps {
  field: CustomField;
  form: any;
  fieldName: string;
}

const BooleanFieldInput: React.FC<BooleanFieldInputProps> = ({ field, form, fieldName }) => {
  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field: formField }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <FormControl>
            <Checkbox
              checked={formField.value}
              onCheckedChange={formField.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>
              {field.name}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
            {field.description && <FormDescription>{field.description}</FormDescription>}
          </div>
        </FormItem>
      )}
    />
  );
};

export default BooleanFieldInput;
