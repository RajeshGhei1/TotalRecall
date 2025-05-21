
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Filter } from '@/services/reportingService';
import { FiltersInputProps } from '../types';

const FiltersInput: React.FC<FiltersInputProps> = ({ 
  filters, 
  setFilters, 
  availableFields, 
  operatorOptions 
}) => {
  const [newFilter, setNewFilter] = useState<Filter>({ field: '', operator: 'equals', value: '' });

  const handleAddFilter = () => {
    if (newFilter.field && newFilter.operator) {
      setFilters([...filters, { ...newFilter }]);
      setNewFilter({ field: '', operator: 'equals', value: '' });
    }
  };

  const handleRemoveFilter = (index: number) => {
    const updatedFilters = [...filters];
    updatedFilters.splice(index, 1);
    setFilters(updatedFilters);
  };

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Filters</h3>
      
      {/* Add Filter */}
      <div className="flex flex-col sm:flex-row gap-2 mb-2">
        <Select 
          value={newFilter.field} 
          onValueChange={(value) => setNewFilter({...newFilter, field: value})}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select field" />
          </SelectTrigger>
          <SelectContent>
            {availableFields.map((field) => (
              <SelectItem key={field.value} value={field.value}>
                {field.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select
          value={newFilter.operator}
          onValueChange={(value) => setNewFilter({...newFilter, operator: value})}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Operator" />
          </SelectTrigger>
          <SelectContent>
            {operatorOptions.map((op) => (
              <SelectItem key={op.value} value={op.value}>
                {op.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Input
          placeholder="Value"
          value={newFilter.value}
          onChange={(e) => setNewFilter({...newFilter, value: e.target.value})}
        />
        
        <Button onClick={handleAddFilter}>Add Filter</Button>
      </div>
      
      {/* Filter List */}
      {filters.length > 0 && (
        <div className="bg-muted/50 p-2 rounded-md">
          <h4 className="text-sm font-medium mb-1">Applied Filters:</h4>
          <ul className="space-y-1">
            {filters.map((filter, index) => {
              const fieldLabel = availableFields.find(f => f.value === filter.field)?.label || filter.field;
              const operatorLabel = operatorOptions.find(o => o.value === filter.operator)?.label || filter.operator;
              
              return (
                <li key={index} className="flex items-center justify-between text-sm p-1 border-b">
                  <span>
                    {fieldLabel} {operatorLabel} "{filter.value}"
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRemoveFilter(index)}
                  >
                    Remove
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FiltersInput;
