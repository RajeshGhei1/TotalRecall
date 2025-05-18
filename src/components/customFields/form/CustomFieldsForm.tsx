
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import FormContainer from './FormContainer';
import CustomFieldsFormHeader from './CustomFieldsFormHeader';
import CustomFieldsList from './CustomFieldsList';
import CustomFieldsFormActions from './CustomFieldsFormActions';
import LoadingState from './LoadingState';
import { useCustomFieldsForm } from './useCustomFieldsForm';

interface CustomFieldsFormProps {
  entityType: string;
  entityId?: string;
  title?: string;
  description?: string;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
  tenantId?: string;
  formContext?: string;
  form?: UseFormReturn<any>;
  enableDragAndDrop?: boolean;
}

const CustomFieldsForm = ({
  entityType,
  entityId,
  title = 'Custom Fields',
  description,
  onSubmit,
  onCancel,
  tenantId,
  formContext,
  form: externalForm,
  enableDragAndDrop = false,
}: CustomFieldsFormProps) => {
  // Use our custom hook to manage form state and logic
  const {
    form,
    orderedFields,
    isLoading,
    handleSubmit,
    handleDragEnd,
  } = useCustomFieldsForm({
    entityType,
    entityId,
    tenantId,
    formContext,
    externalForm,
    onSubmit,
  });
  
  // Return loading state or form
  if (isLoading) {
    return <LoadingState />;
  }

  if (!form) {
    return <div>Form configuration error</div>;
  }

  return (
    <FormContainer form={form} onSubmit={handleSubmit}>
      <CustomFieldsFormHeader title={title} description={description} />
      
      <CustomFieldsList
        fields={orderedFields}
        form={form}
        enableDragAndDrop={enableDragAndDrop}
        onDragEnd={handleDragEnd}
      />
      
      <CustomFieldsFormActions onCancel={onCancel} />
    </FormContainer>
  );
};

export default CustomFieldsForm;
