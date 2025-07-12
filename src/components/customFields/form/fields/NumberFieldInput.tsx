
import React from 'react';
import { CustomField } from '@/hooks/customFields/types';
import { Input } from '@/components/ui/input';
import BaseFieldInput from './BaseFieldInput';
import { UseFormReturn } from 'react-hook-form';
import { CustomFormData } from '@/types/common';

interface NumberFieldInputProps {
  field: CustomField;
  form: UseFormReturn<CustomFormData>;
  fieldName: string;
}

const NumberFieldInput: React.FC<NumberFieldInputProps> = ({ field, form, fieldName }) => {
  return (
    <BaseFieldInput field={field} form={form} fieldName={fieldName}>
      {(formField) => (
        <Input 
          type="number" 
          {...formField} 
          value={String(formField.value || '')}
          onChange={(e) => formField.onChange(parseFloat(e.target.value) || '')}
          placeholder={`Enter ${field.name.toLowerCase()}`} 
        />
      )}
    </BaseFieldInput>
  );
};

export default NumberFieldInput;
