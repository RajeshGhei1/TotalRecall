
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface FormTextareaProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  readOnly?: boolean;
}

export const FormTextarea: React.FC<FormTextareaProps> = ({
  form,
  name,
  label,
  placeholder,
  required,
  rows = 4,
  readOnly = false,
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}{required && <span className="text-red-500 ml-1">*</span>}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              rows={rows}
              {...field}
              readOnly={readOnly}
              className={readOnly ? "bg-gray-50" : ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
