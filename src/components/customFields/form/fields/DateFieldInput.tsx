
import React from 'react';
import { CustomField } from '@/hooks/customFields/types';
import { format } from 'date-fns';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface DateFieldInputProps {
  field: CustomField;
  form: any;
  fieldName: string;
}

const DateFieldInput: React.FC<DateFieldInputProps> = ({ field, form, fieldName }) => {
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
          <FormControl>
            <Input 
              type="date" 
              {...formField} 
              value={formField.value ? (
                typeof formField.value === 'string' 
                  ? formField.value 
                  : format(new Date(formField.value), 'yyyy-MM-dd')
              ) : ''}
            />
          </FormControl>
          {field.description && <FormDescription>{field.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DateFieldInput;
