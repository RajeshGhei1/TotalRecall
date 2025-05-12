
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
import { Textarea } from '@/components/ui/textarea';

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
            <Textarea 
              placeholder="Option 1, Option 2, Option 3" 
              className="min-h-[80px]"
              {...field}
              value={typeof field.value === 'string' ? field.value : 
                Array.isArray(field.value) ? field.value.map(opt => 
                  typeof opt === 'string' ? opt : 
                  (opt.label || opt.value || '')
                ).join(', ') : 
                ''
              }
            />
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
