
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
import { Input } from '@/components/ui/input';

interface TextFieldInputProps {
  field: CustomField;
  form: any;
  fieldName: string;
}

const TextFieldInput: React.FC<TextFieldInputProps> = ({ field, form, fieldName }) => {
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
            <Input {...formField} placeholder={`Enter ${field.name.toLowerCase()}`} />
          </FormControl>
          {field.description && <FormDescription>{field.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TextFieldInput;
