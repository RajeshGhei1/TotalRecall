
import React from 'react';
import { CustomField } from '@/hooks/customFields/types';
import { Textarea } from '@/components/ui/textarea';
import BaseFieldInput from './BaseFieldInput';

interface TextareaInputProps {
  field: CustomField;
  form: any;
  fieldName: string;
}

const TextareaInput: React.FC<TextareaInputProps> = ({ field, form, fieldName }) => {
  return (
    <BaseFieldInput field={field} form={form} fieldName={fieldName}>
      {(formField) => (
        <Textarea 
          {...formField} 
          placeholder={`Enter ${field.name.toLowerCase()}`} 
        />
      )}
    </BaseFieldInput>
  );
};

export default TextareaInput;
