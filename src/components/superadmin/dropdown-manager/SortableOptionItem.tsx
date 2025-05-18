
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Trash, GripVertical } from 'lucide-react';
import { DropdownOption } from '@/hooks/dropdown/types';

interface SortableOptionItemProps {
  option: DropdownOption;
  onDelete: (id: string) => void;
}

const SortableOptionItem = ({ option, onDelete }: SortableOptionItemProps) => {
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition 
  } = useSortable({ id: option.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr 
      ref={setNodeRef} 
      style={style} 
      className="group hover:bg-slate-50"
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-grab">
        <div className="flex items-center" {...attributes} {...listeners}>
          <GripVertical className="h-5 w-5 text-gray-400 opacity-50 group-hover:opacity-100" />
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {option.value}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {option.label}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onDelete(option.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash className="h-4 w-4 text-red-500" />
        </Button>
      </td>
    </tr>
  );
};

export default SortableOptionItem;
