
import React, { useState } from 'react';
import { useCustomFieldsQuery, CustomField } from '@/hooks/customFields/useCustomFieldsQuery';
import { useCustomFieldsMutations } from '@/hooks/customFields/useCustomFieldsMutations';
import CustomFieldForm, { FieldFormValues } from '../CustomFieldForm';
import CustomFieldList from '../CustomFieldList';
import CustomFieldsHeader from './CustomFieldsHeader';

interface CustomFieldsManagerProps {
  tenantId: string;
  formContext?: string;
}

const CustomFieldsManager: React.FC<CustomFieldsManagerProps> = ({ tenantId, formContext }) => {
  const [isAddingField, setIsAddingField] = useState(false);
  
  // Use our custom hooks
  const { data: customFields = [], isLoading } = useCustomFieldsQuery(tenantId, formContext);
  const { addFieldMutation, deleteFieldMutation } = useCustomFieldsMutations(tenantId);

  const handleAddField = (values: FieldFormValues) => {
    addFieldMutation.mutate(values as any, {
      onSuccess: () => setIsAddingField(false)
    });
  };

  const handleDeleteField = (fieldId: string) => {
    if (confirm('Are you sure you want to delete this custom field? All data associated with it will be lost.')) {
      deleteFieldMutation.mutate(fieldId);
    }
  };

  return (
    <div className="space-y-8">
      <CustomFieldsHeader
        onAddField={() => setIsAddingField(true)}
        isAddingField={isAddingField}
      />

      {isAddingField && (
        <CustomFieldForm
          onSubmit={handleAddField}
          onCancel={() => setIsAddingField(false)}
          isSubmitting={addFieldMutation.isPending}
          tenantId={tenantId}
        />
      )}

      <CustomFieldList
        fields={customFields}
        isLoading={isLoading}
        onDelete={handleDeleteField}
        isDeleting={deleteFieldMutation.isPending}
      />
    </div>
  );
};

export default CustomFieldsManager;
