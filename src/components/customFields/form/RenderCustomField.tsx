
import React from 'react';
import { CustomField } from '@/hooks/customFields/types';
import TextFieldInput from './fields/TextFieldInput';
import TextareaInput from './fields/TextareaInput';
import NumberFieldInput from './fields/NumberFieldInput';
import DateFieldInput from './fields/DateFieldInput';
import DropdownFieldInput from './fields/DropdownFieldInput';
import BooleanFieldInput from './fields/BooleanFieldInput';

interface RenderCustomFieldProps {
  field: CustomField;
  form: any;
}

const RenderCustomField: React.FC<RenderCustomFieldProps> = ({ field, form }) => {
  const fieldName = `custom_${field.field_key}`;
  
  switch (field.field_type) {
    case 'text':
      return (
        <TextFieldInput
          field={field}
          form={form}
          fieldName={fieldName}
        />
      );
    
    case 'textarea':
      return (
        <TextareaInput 
          field={field}
          form={form}
          fieldName={fieldName}
        />
      );
    
    case 'number':
      return (
        <NumberFieldInput 
          field={field}
          form={form}
          fieldName={fieldName}
        />
      );
    
    case 'date':
      return (
        <DateFieldInput
          field={field}
          form={form} 
          fieldName={fieldName}
        />
      );
    
    case 'dropdown':
      return (
        <DropdownFieldInput 
          field={field}
          form={form}
          fieldName={fieldName}
        />
      );
    
    case 'boolean':
      return (
        <BooleanFieldInput
          field={field}
          form={form}
          fieldName={fieldName}
        />
      );
    
    default:
      return null;
  }
};

export default RenderCustomField;
