
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ManagerSelectorProps {
  reportsTo: string;
  potentialManagers: Array<{ person: {
    id: string;
    full_name: string;
    email?: string | null;
    type?: string;
    role?: string;
  } | null }>;
  onManagerChange: (value: string) => void;
}

const ManagerSelector: React.FC<ManagerSelectorProps> = ({
  reportsTo,
  potentialManagers,
  onManagerChange
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="reports_to">Reports To</Label>
      <Select 
        value={reportsTo} 
        onValueChange={onManagerChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a manager (optional)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">None</SelectItem>
          {potentialManagers.map(item => {
            if (!item || !item.person) {
              return null;
            }
            
            return (
              <SelectItem key={item.person.id} value={item.person.id}>
                <div className="flex flex-col">
                  <span>{item.person.full_name}</span>
                  {item.person.role && (
                    <span className="text-xs text-muted-foreground">{item.person.role}</span>
                  )}
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ManagerSelector;
