
import React from 'react';
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
}

const CustomFieldList: React.FC<CustomFieldListProps> = ({
  fields,
  isLoading,
  onDelete,
  isDeleting,
}) => {
  if (isLoading) {
    return <div>Loading custom fields...</div>;
  }

  if (fields.length === 0) {
    return <div>No custom fields have been defined yet.</div>;
  }

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
