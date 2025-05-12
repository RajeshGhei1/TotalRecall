
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
            value={field.value as string || ""}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select field type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="z-[1000] bg-white">
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="textarea">Text Area</SelectItem>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="dropdown">Dropdown</SelectItem>
              <SelectItem value="boolean">Yes/No</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormTypeSelect;
