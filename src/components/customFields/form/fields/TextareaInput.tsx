
import React from 'react';
import { CustomField } from '@/hooks/customFields/types';
import { Textarea } from '@/components/ui/textarea';
import BaseFieldInput from './BaseFieldInput';
import { UseFormReturn } from 'react-hook-form';
import { CustomFormData } from '@/types/common';

interface TextareaInputProps {
  field: CustomField;
  form: UseFormReturn<CustomFormData>;
  fieldName: string;
}

const TextareaInput: React.FC<TextareaInputProps> = ({ field, form, fieldName }) => {
  return (
    <BaseFieldInput field={field} form={form} fieldName={fieldName}>
      {(formField) => (
        <Textarea 
          {...formField} 
          value={String(formField.value || '')}
          placeholder={`Enter ${field.name.toLowerCase()}`} 
        />
      )}
    </BaseFieldInput>
  );
};

export default TextareaInput;
