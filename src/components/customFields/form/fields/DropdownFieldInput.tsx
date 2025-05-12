
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DropdownFieldInputProps {
  field: CustomField;
  form: any;
  fieldName: string;
}

const DropdownFieldInput: React.FC<DropdownFieldInputProps> = ({ field, form, fieldName }) => {
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
          <Select
            onValueChange={formField.onChange}
            value={formField.value || ""}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${field.name.toLowerCase()}`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {field.options?.options?.map((option: { value: string; label: string }) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {field.description && <FormDescription>{field.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DropdownFieldInput;
