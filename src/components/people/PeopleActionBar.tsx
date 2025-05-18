
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, UserPlus } from 'lucide-react';

interface PeopleActionBarProps {
  personType: 'talent' | 'contact';
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  onAddPerson: () => void;
}

const PeopleActionBar = ({ personType, searchQuery, setSearchQuery, onAddPerson }: PeopleActionBarProps) => {
  return (
    <div className="flex justify-between mb-6">
      <div className="relative w-72">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder={`Search ${personType === 'talent' ? 'talents' : 'contacts'}...`} 
          className="pl-8" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Button onClick={onAddPerson}>
        <UserPlus className="mr-2 h-4 w-4" />
        Add {personType === 'talent' ? 'Talent' : 'Contact'}
      </Button>
    </div>
  );
};

export default PeopleActionBar;
