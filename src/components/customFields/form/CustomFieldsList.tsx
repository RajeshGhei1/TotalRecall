
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CustomField } from '@/hooks/customFields/types';
import RenderCustomField from './RenderCustomField';
import SortableFieldList from './SortableFieldList';

interface CustomFieldsListProps {
  fields: CustomField[];
  form: UseFormReturn<any>;
  enableDragAndDrop?: boolean;
  onDragEnd?: (oldIndex: number, newIndex: number) => void;
}

const CustomFieldsList: React.FC<CustomFieldsListProps> = ({
  fields,
  form,
  enableDragAndDrop = false,
  onDragEnd
}) => {
  if (!fields || fields.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No custom fields found for this entity type.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {enableDragAndDrop ? (
        <SortableFieldList 
          fields={fields} 
          form={form} 
          onDragEnd={onDragEnd} 
        />
      ) : (
        fields.map((field) => (
          <RenderCustomField
            key={field.field_key}
            field={field}
            form={form}
          />
        ))
      )}
    </div>
  );
};

export default CustomFieldsList;
