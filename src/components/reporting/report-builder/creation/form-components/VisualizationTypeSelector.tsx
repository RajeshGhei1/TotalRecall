
import React from 'react';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface VisualizationTypeSelectorProps {
  visualizationType: string;
  visualizationOptions: { value: string; label: string }[];
  onVisualizationTypeChange: (value: string) => void;
}

const VisualizationTypeSelector: React.FC<VisualizationTypeSelectorProps> = ({ 
  visualizationType,
  visualizationOptions,
  onVisualizationTypeChange
}) => {
  return (
    <div>
      <Label htmlFor="visualization-type">Visualization Type</Label>
      <Select 
        value={visualizationType} 
        onValueChange={onVisualizationTypeChange}
      >
        <SelectTrigger id="visualization-type">
          <SelectValue placeholder="Select visualization type" />
        </SelectTrigger>
        <SelectContent>
          {visualizationOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default VisualizationTypeSelector;
