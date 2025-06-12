
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ReportingPerson {
  id: string;
  full_name: string;
  email?: string | null;
  type?: string;
  role?: string;
}

interface ManagerSelectorProps {
  reportsTo: string | undefined;
  potentialManagers: Array<{ person: ReportingPerson | null }>;
  onManagerChange: (value: string) => void;
}

const ManagerSelector: React.FC<ManagerSelectorProps> = ({
  reportsTo,
  potentialManagers,
  onManagerChange
}) => {
  console.log('ManagerSelector potentialManagers:', potentialManagers);

  return (
    <div className="space-y-2">
      <Label htmlFor="reports_to">Reports To</Label>
      <Select 
        value={reportsTo || ''} 
        onValueChange={onManagerChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a manager (optional)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">None</SelectItem>
          {potentialManagers && potentialManagers.length > 0 ? (
            potentialManagers.map(item => {
              // Skip invalid entries where person data might be null
              if (!item || !item.person) {
                console.log('Skipping invalid manager item:', item);
                return null;
              }
              
              return (
                <SelectItem key={item.person.id} value={item.person.id}>
                  {item.person.full_name} {item.person.role ? `(${item.person.role})` : ''}
                </SelectItem>
              );
            })
          ) : (
            <SelectItem value="" disabled>No managers available</SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ManagerSelector;
