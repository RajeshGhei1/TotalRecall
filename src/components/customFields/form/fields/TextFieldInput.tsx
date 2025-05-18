
import React from 'react';
import { CustomField } from '@/hooks/customFields/types';
import { Input } from '@/components/ui/input';
import BaseFieldInput from './BaseFieldInput';

interface TextFieldInputProps {
  field: CustomField; 
  form: any;
  fieldName: string;
}

const TextFieldInput: React.FC<TextFieldInputProps> = ({ field, form, fieldName }) => {
  return (
    <BaseFieldInput field={field} form={form} fieldName={fieldName}>
      {(formField) => (
        <Input 
          {...formField} 
          value={formField.value || ''} 
          placeholder={`Enter ${field.name.toLowerCase()}`} 
        />
      )}
    </BaseFieldInput>
  );
};

export default TextFieldInput;
