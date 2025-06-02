
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { FieldFormValues } from '../CustomFieldForm';

interface FormTypeSelectProps {
  form: UseFormReturn<FieldFormValues>;
}

const fieldTypeOptions = [
  { value: 'text', label: 'Text' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'multiselect', label: 'Multi-Select' },
  { value: 'boolean', label: 'Yes/No' }
];

const FormTypeSelect: React.FC<FormTypeSelectProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="fieldType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Field Type</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value as string || undefined}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select field type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="z-[1000] bg-white">
              {fieldTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormTypeSelect;
