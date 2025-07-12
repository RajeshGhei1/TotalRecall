
import React from 'react';
import { CustomField } from '@/hooks/customFields/types';
import { Input } from '@/components/ui/input';
import BaseFieldInput from './BaseFieldInput';
import { UseFormReturn } from 'react-hook-form';
import { CustomFormData } from '@/types/common';

interface TextFieldInputProps {
  field: CustomField; 
  form: UseFormReturn<CustomFormData>;
  fieldName: string;
}

const TextFieldInput: React.FC<TextFieldInputProps> = ({ field, form, fieldName }) => {
  return (
    <BaseFieldInput field={field} form={form} fieldName={fieldName}>
      {(formField) => (
        <Input 
          {...formField} 
          value={String(formField.value || '')} 
          placeholder={`Enter ${field.name.toLowerCase()}`} 
        />
      )}
    </BaseFieldInput>
  );
};

export default TextFieldInput;
