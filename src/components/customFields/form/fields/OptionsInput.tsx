
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { FieldFormValues } from '../CustomFieldForm';

interface OptionsInputProps {
  form: UseFormReturn<FieldFormValues>;
}

const OptionsInput: React.FC<OptionsInputProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="options"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Options</FormLabel>
          <FormControl>
            <Input {...field} placeholder="Option 1, Option 2, Option 3" />
          </FormControl>
          <FormDescription>
            Comma-separated list of options
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default OptionsInput;
