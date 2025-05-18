
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, UserPlus, Building } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PeopleActionBarProps {
  personType: 'talent' | 'contact';
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  onAddPerson: () => void;
  companyFilter?: string;
  setCompanyFilter?: (value: string) => void;
  companyOptions?: { id: string; name: string }[];
}

const PeopleActionBar = ({ 
  personType, 
  searchQuery, 
  setSearchQuery, 
  onAddPerson,
  companyFilter,
  setCompanyFilter,
  companyOptions = []
}: PeopleActionBarProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:w-auto">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder={`Search ${personType === 'talent' ? 'talents' : 'contacts'}...`} 
            className="pl-8" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {setCompanyFilter && (
          <div className="w-full sm:w-64">
            <Select 
              value={companyFilter} 
              onValueChange={setCompanyFilter}
            >
              <SelectTrigger className="w-full">
                <div className="flex items-center">
                  <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Filter by company" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Companies</SelectItem>
                {companyOptions.map(company => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      
      <Button onClick={onAddPerson}>
        <UserPlus className="mr-2 h-4 w-4" />
        Add {personType === 'talent' ? 'Talent' : 'Contact'}
      </Button>
    </div>
  );
};

export default PeopleActionBar;
