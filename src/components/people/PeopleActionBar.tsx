
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, UserPlus, Building, Upload, Database } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';

interface PeopleActionBarProps {
  personType: 'talent' | 'contact';
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  onAddPerson: () => void;
  onBulkUpload?: () => void;
  onApiConnection?: () => void;
  companyFilter?: string;
  setCompanyFilter?: (value: string) => void;
  companyOptions?: { id: string; name: string }[];
}

const PeopleActionBar = ({ 
  personType, 
  searchQuery, 
  setSearchQuery, 
  onAddPerson,
  onBulkUpload,
  onApiConnection,
  companyFilter,
  setCompanyFilter,
  companyOptions = []
}: PeopleActionBarProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center w-full">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder={`Search ${personType === 'talent' ? 'talents' : 'contacts'}...`} 
            className="pl-8 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30" 
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
              <SelectTrigger className="w-full focus:border-primary focus:ring-1 focus:ring-primary/30">
                <div className="flex items-center">
                  <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Filter by company" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
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
      
      <div className="flex flex-wrap gap-2">
        {onBulkUpload && (
          <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={onBulkUpload} className="flex-grow sm:flex-grow-0">
            <Upload className="mr-2 h-4 w-4" />
            {!isMobile && "Bulk Upload"}
          </Button>
        )}
        
        {onApiConnection && (
          <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={onApiConnection} className="flex-grow sm:flex-grow-0">
            <Database className="mr-2 h-4 w-4" />
            {!isMobile && "API Connection"}
          </Button>
        )}
        
        <Button variant="gradient" onClick={onAddPerson} className="flex-grow sm:flex-grow-0">
          <UserPlus className="mr-2 h-4 w-4" />
          {isMobile ? `Add ${personType === 'talent' ? 'Talent' : 'Contact'}` : `Add ${personType === 'talent' ? 'Talent' : 'Contact'}`}
        </Button>
      </div>
    </div>
  );
};

export default PeopleActionBar;
