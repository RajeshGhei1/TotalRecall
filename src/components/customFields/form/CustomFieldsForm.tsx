
import React, { useEffect } from 'react';
import { useCustomFields } from '@/hooks/useCustomFields';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { CustomField } from '@/hooks/customFields/types';
import RenderCustomField from './RenderCustomField';

interface CustomFieldsFormProps {
  tenantId: string;
  entityType: string;
  entityId?: string;
  formContext?: string;
  form: any;
}

const CustomFieldsForm: React.FC<CustomFieldsFormProps> = ({
  tenantId,
  entityType,
  entityId,
  formContext,
  form,
}) => {
  const { customFields, isLoading, getCustomFieldValues } = useCustomFields(tenantId, {
    formContext
  });

  // Fetch existing values if entityId is provided
  const { data: fieldValues = [] } = useQuery({
    queryKey: ['customFieldValues', entityType, entityId, formContext],
    queryFn: async () => {
      if (!entityId) return [];
      return await getCustomFieldValues(entityType, entityId);
    },
    enabled: !!entityId,
  });

  // Use useEffect to set form values when fieldValues are loaded
  useEffect(() => {
    if (fieldValues && fieldValues.length > 0) {
      const values = {};
      fieldValues.forEach((item) => {
        const fieldKey = item.custom_fields?.field_key;
        if (fieldKey) {
          values[`custom_${fieldKey}`] = item.value;
        }
      });
      form.reset({ ...form.getValues(), ...values });
    }
  }, [fieldValues, form]);

  if (isLoading) {
    return <Card><CardContent className="py-4">Loading custom fields...</CardContent></Card>;
  }

  if (customFields.length === 0) {
    return <Card><CardContent className="py-4">No custom fields defined</CardContent></Card>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {customFields.map((field: CustomField) => (
          <RenderCustomField 
            key={field.id}
            field={field}
            form={form}
          />
        ))}
      </div>
    </div>
  );
};

export default CustomFieldsForm;
