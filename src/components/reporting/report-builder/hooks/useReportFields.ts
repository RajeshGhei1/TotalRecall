
import { useState, useEffect } from 'react';
import { useCustomFieldsList } from '@/hooks/customFields/useCustomFieldsList';

export interface FieldOption {
  value: string;
  label: string;
}

export const useReportFields = (entity: string) => {
  const [availableFields, setAvailableFields] = useState<FieldOption[]>([]);
  
  // Get custom fields for the selected entity
  const { customFields } = useCustomFieldsList({ entityType: entity });

  // Update available fields when entity changes
  useEffect(() => {
    const getFields = async () => {
      try {
        // For demo purposes, we'll use a hardcoded list of fields for each entity
        // In a real app, this would come from schema metadata or custom fields
        let fields: FieldOption[] = [];

        // Common fields
        fields.push({ value: 'id', label: 'ID' });
        fields.push({ value: 'created_at', label: 'Created At' });
        fields.push({ value: 'updated_at', label: 'Updated At' });

        // Entity-specific fields
        if (entity === 'companies') {
          fields = [
            ...fields,
            { value: 'name', label: 'Name' },
            { value: 'website', label: 'Website' },
            { value: 'industry', label: 'Industry' },
            { value: 'size', label: 'Size' },
          ];
        } else if (entity === 'people') {
          fields = [
            ...fields,
            { value: 'name', label: 'Name' },
            { value: 'email', label: 'Email' },
            { value: 'phone', label: 'Phone' },
            { value: 'position', label: 'Position' },
          ];
        } else if (entity === 'talents') {
          fields = [
            ...fields,
            { value: 'name', label: 'Name' },
            { value: 'skills', label: 'Skills' },
            { value: 'experience', label: 'Experience' },
            { value: 'education', label: 'Education' },
          ];
        }

        // Add custom fields if available
        if (customFields?.length > 0) {
          customFields.forEach(field => {
            fields.push({
              value: field.field_key,
              label: field.name,
            });
          });
        }

        setAvailableFields(fields);
      } catch (error) {
        console.error('Error loading fields:', error);
      }
    };

    getFields();
  }, [entity, customFields]);

  return { availableFields };
};
