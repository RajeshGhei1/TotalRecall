
import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatFormsList } from '@/utils/formUtils';
import SortableFieldItem from './SortableFieldItem';

interface CustomField {
  id: string;
  name: string;
  field_key: string;
  field_type: string;
  required: boolean;
  applicable_forms?: string[];
  description?: string;
}

interface CustomFieldListProps {
  fields: CustomField[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  onReorder?: (fields: CustomField[]) => void;
  canReorder?: boolean;
}

const CustomFieldList: React.FC<CustomFieldListProps> = ({
  fields,
  isLoading,
  onDelete,
  isDeleting,
  onReorder,
  canReorder = false,
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
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);
      
      // Reorder the list of fields
      const newFields = [...fields];
      const [movedItem] = newFields.splice(oldIndex, 1);
      newFields.splice(newIndex, 0, movedItem);
      
      // Call the callback with reordered fields
      if (onReorder) {
        onReorder(newFields);
      }
    }
  };

  if (isLoading) {
    return <div>Loading custom fields...</div>;
  }

  if (fields.length === 0) {
    return <div>No custom fields have been defined yet.</div>;
  }

  if (canReorder && onReorder) {
    return (
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {canReorder && <TableHead className="w-10"></TableHead>}
              <TableHead>Display Name</TableHead>
              <TableHead>Field Key</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Required</TableHead>
              <TableHead>Used In</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <TableBody>
              <SortableContext
                items={fields.map((field) => field.id)}
                strategy={verticalListSortingStrategy}
              >
                {fields.map((field) => (
                  <SortableFieldItem 
                    key={field.id}
                    field={field}
                    onDelete={onDelete}
                    isDeleting={isDeleting}
                  />
                ))}
              </SortableContext>
            </TableBody>
          </DndContext>
        </Table>
      </div>
    );
  }

  // Non-sortable version
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Display Name</TableHead>
            <TableHead>Field Key</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Required</TableHead>
            <TableHead>Used In</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.map((field) => (
            <TableRow key={field.id}>
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
                  className="text-destructive hover:text-destructive"
                  disabled={isDeleting}
                  onClick={() => onDelete(field.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomFieldList;
