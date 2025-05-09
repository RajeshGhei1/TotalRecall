
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Trash } from 'lucide-react';

interface CustomField {
  id: string;
  name: string;
  field_key: string;
  field_type: string;
  required: boolean;
  description?: string;
}

interface CustomFieldListProps {
  fields: CustomField[];
  isLoading: boolean;
  onDelete: (fieldId: string) => void;
  isDeleting: boolean;
}

const CustomFieldList: React.FC<CustomFieldListProps> = ({ 
  fields, 
  isLoading, 
  onDelete,
  isDeleting
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (fields.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md">
        <p className="text-muted-foreground">No custom fields defined yet</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {fields.map((field) => (
        <div
          key={field.id}
          className="flex justify-between items-center p-4 border rounded-md"
        >
          <div>
            <div className="font-medium">{field.name}</div>
            <div className="text-sm text-muted-foreground">
              {field.field_key} ({field.field_type})
              {field.required && <span className="ml-2 text-destructive">*Required</span>}
            </div>
            {field.description && (
              <div className="text-sm mt-1">{field.description}</div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(field.id)}
            disabled={isDeleting}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default CustomFieldList;
