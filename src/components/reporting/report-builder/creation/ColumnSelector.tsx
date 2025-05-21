
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ColumnSelectorProps } from '../types';

const ColumnSelector: React.FC<ColumnSelectorProps> = ({ 
  columns, 
  availableFields, 
  onColumnChange 
}) => {
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Select Columns</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {availableFields.map((field) => (
          <div key={field.value} className="flex items-center space-x-2">
            <Checkbox 
              id={`column-${field.value}`}
              checked={columns.includes(field.value)}
              onCheckedChange={(checked) => onColumnChange(field.value, !!checked)}
            />
            <Label htmlFor={`column-${field.value}`} className="text-sm">
              {field.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColumnSelector;
