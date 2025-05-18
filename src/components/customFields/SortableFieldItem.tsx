
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, GripVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatFormsList } from '@/utils/formUtils';

interface CustomField {
  id: string;
  name: string;
  field_key: string;
  field_type: string;
  required: boolean;
  applicable_forms?: string[];
  description?: string;
}

interface SortableFieldItemProps {
  field: CustomField;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

const SortableFieldItem: React.FC<SortableFieldItemProps> = ({ field, onDelete, isDeleting }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className="group hover:bg-slate-50"
    >
      <TableCell className="w-10 text-center">
        <div className="flex items-center justify-center cursor-grab" {...attributes} {...listeners}>
          <GripVertical className="h-5 w-5 text-gray-400 opacity-50 group-hover:opacity-100" />
        </div>
      </TableCell>
      <TableCell className="font-medium">{field.name}</TableCell>
      <TableCell className="font-mono text-sm">{field.field_key}</TableCell>
      <TableCell>
        <Badge variant="outline">{field.field_type}</Badge>
      </TableCell>
      <TableCell>{field.required ? 'Yes' : 'No'}</TableCell>
      <TableCell>
        <span className="text-sm text-muted-foreground">
          {formatFormsList(field.applicable_forms || [])}
        </span>
      </TableCell>
      <TableCell>
        <Button
          size="sm"
          variant="ghost"
          className="text-destructive hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
          disabled={isDeleting}
          onClick={() => onDelete(field.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default SortableFieldItem;
