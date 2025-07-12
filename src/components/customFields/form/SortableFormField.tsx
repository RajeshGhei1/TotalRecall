
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import RenderCustomField from './RenderCustomField';
import { CustomField } from '@/hooks/customFields/types';
import { UseFormReturn } from 'react-hook-form';
import { GripVertical } from 'lucide-react';
import { CustomFormData } from '@/types/common';

interface SortableFormFieldProps {
  field: CustomField;
  form: UseFormReturn<CustomFormData>;
}

const SortableFormField: React.FC<SortableFormFieldProps> = ({ field, form }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className="relative group border rounded-md p-4 bg-white"
    >
      <div 
        {...attributes} 
        {...listeners}
        className="absolute left-2 top-4 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical className="h-5 w-5 text-gray-400" />
      </div>
      <div className="ml-8">
        <RenderCustomField field={field} form={form} />
      </div>
    </div>
  );
};

export default SortableFormField;
