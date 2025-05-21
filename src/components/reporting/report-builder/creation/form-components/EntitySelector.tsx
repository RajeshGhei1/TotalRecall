
import React from 'react';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { EntityOption } from '../../types';

interface EntitySelectorProps {
  entity: string;
  entityOptions: EntityOption[];
  onEntityChange: (value: string) => void;
}

const EntitySelector: React.FC<EntitySelectorProps> = ({ 
  entity,
  entityOptions,
  onEntityChange
}) => {
  return (
    <div>
      <Label htmlFor="entity-select">Select Entity</Label>
      <Select 
        value={entity} 
        onValueChange={onEntityChange}
      >
        <SelectTrigger id="entity-select" className="w-full">
          <SelectValue placeholder="Select an entity" />
        </SelectTrigger>
        <SelectContent>
          {entityOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default EntitySelector;
