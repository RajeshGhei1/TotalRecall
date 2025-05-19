
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Building, Search } from 'lucide-react';

interface CompanySearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onAddCompany: () => void;
}

const CompanySearch: React.FC<CompanySearchProps> = ({
  searchTerm,
  setSearchTerm,
  onAddCompany
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search companies..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Button onClick={onAddCompany}>
        <Building className="mr-2 h-4 w-4" />
        Add Company
      </Button>
    </div>
  );
};

export default CompanySearch;
