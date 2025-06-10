
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { MultiSelect, MultiSelectOption } from '@/components/ui/multi-select';

interface FormMultiSelectProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  options: MultiSelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  maxCount?: number;
  className?: string;
}

export const FormMultiSelect: React.FC<FormMultiSelectProps> = ({
  form,
  name,
  label,
  options,
  placeholder,
  required,
  disabled = false,
  maxCount = 3,
  className,
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <MultiSelect
              options={options}
              onValueChange={field.onChange}
              value={field.value || []}
              placeholder={placeholder || `Select ${label.toLowerCase()}`}
              disabled={disabled}
              maxCount={maxCount}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
