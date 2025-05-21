
import React from 'react';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { FieldOption } from '../../hooks/useReportFields';

interface GroupBySelectorProps {
  groupBy: string;
  availableFields: FieldOption[];
  onGroupByChange: (value: string) => void;
}

const GroupBySelector: React.FC<GroupBySelectorProps> = ({ 
  groupBy,
  availableFields,
  onGroupByChange
}) => {
  return (
    <div>
      <Label htmlFor="group-by">Group By (Optional)</Label>
      <Select 
        value={groupBy} 
        onValueChange={onGroupByChange}
      >
        <SelectTrigger id="group-by">
          <SelectValue placeholder="Select field (optional)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          {availableFields.map((field) => (
            <SelectItem key={field.value} value={field.value}>
              {field.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default GroupBySelector;
