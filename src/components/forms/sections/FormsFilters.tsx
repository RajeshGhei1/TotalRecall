
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

interface FormsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  visibilityFilter: string;
  onVisibilityFilterChange: (value: string) => void;
  accessFilter: string;
  onAccessFilterChange: (value: string) => void;
}

const FormsFilters: React.FC<FormsFiltersProps> = ({
  searchTerm,
  onSearchChange,
  visibilityFilter,
  onVisibilityFilterChange,
  accessFilter,
  onAccessFilterChange
}) => {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search forms..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={visibilityFilter} onValueChange={onVisibilityFilterChange}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Visibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Visibility</SelectItem>
            <SelectItem value="global">Global</SelectItem>
            <SelectItem value="tenant_specific">Tenant Specific</SelectItem>
            <SelectItem value="module_specific">Module Specific</SelectItem>
          </SelectContent>
        </Select>

        <Select value={accessFilter} onValueChange={onAccessFilterChange}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Access Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Access</SelectItem>
            <SelectItem value="public">Public</SelectItem>
            <SelectItem value="authenticated">Authenticated</SelectItem>
            <SelectItem value="role_based">Role Based</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FormsFilters;
