
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface FormInputProps {
  form: UseFormReturnunknown;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
  readOnly?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
  form,
  name,
  label,
  placeholder,
  required,
  type = 'text',
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
            <Input
              placeholder={placeholder}
              {...field}
              type={type}
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
