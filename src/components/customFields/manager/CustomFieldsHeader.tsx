
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface CustomFieldsHeaderProps {
  onAddField: () => void;
  isAddingField: boolean;
}

const CustomFieldsHeader: React.FC<CustomFieldsHeaderProps> = ({
  onAddField,
  isAddingField
}) => {
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-medium">Custom Fields</h3>
      <Button
        onClick={onAddField}
        disabled={isAddingField}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Custom Field
      </Button>
    </div>
  );
};

export default CustomFieldsHeader;
