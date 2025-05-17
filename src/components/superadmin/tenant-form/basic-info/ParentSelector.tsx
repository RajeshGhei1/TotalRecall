
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Tenant {
  id: string;
  name: string;
}

interface ParentSelectorProps {
  tenants: Tenant[];
}

const ParentSelector: React.FC<ParentSelectorProps> = ({ tenants }) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Parent</label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="[Choose One]" />
        </SelectTrigger>
        <SelectContent className="z-50 bg-background">
          <SelectItem value="none">None</SelectItem>
          {tenants.map((tenant) => (
            <SelectItem key={tenant.id} value={tenant.id || 'unknown'}>
              {tenant.name || 'Unnamed Tenant'}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ParentSelector;
