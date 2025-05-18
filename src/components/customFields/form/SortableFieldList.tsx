
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CustomField } from '@/hooks/customFields/types';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableFormField from './SortableFormField';

interface SortableFieldListProps {
  fields: CustomField[];
  form: UseFormReturn<any>;
  onDragEnd?: (oldIndex: number, newIndex: number) => void;
}

const SortableFieldList: React.FC<SortableFieldListProps> = ({ 
  fields, 
  form, 
  onDragEnd 
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex(field => field.id === active.id);
      const newIndex = fields.findIndex(field => field.id === over.id);
      
      if (onDragEnd) {
        onDragEnd(oldIndex, newIndex);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={fields.map(field => field.id)}
        strategy={verticalListSortingStrategy}
      >
        {fields.map((field) => (
          <SortableFormField
            key={field.id}
            field={field}
            form={form}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default SortableFieldList;
