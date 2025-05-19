
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, UserPlus } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Person } from '@/types/person';
import { SearchPersonsProps } from './types';

const SearchPersons: React.FC<SearchPersonsProps> = ({ 
  personType, 
  onPersonSelected,
  onCreatePerson
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [people, setPeople] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchPeople = async () => {
    if (!searchQuery) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('people')
        .select('*')
        .eq('type', personType)
        .ilike('full_name', `%${searchQuery}%`)
        .limit(10);
        
      if (error) throw error;
      
      if (data) {
        // Explicitly cast the data as Person[] to ensure type compatibility
        setPeople(data.map(person => ({
          ...person,
          type: person.type as 'talent' | 'contact'
        })));
      }
    } catch (error) {
      console.error('Error searching people:', error);
      toast.error('Failed to search people');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder={`Search ${personType === 'talent' ? 'talent' : 'business contacts'}...`}
            className="pl-8" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchPeople()}
          />
        </div>
        <Button onClick={searchPeople} disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      <div className="max-h-60 overflow-y-auto border rounded-md">
        {people.length === 0 ? (
          <div className="text-center p-4 text-muted-foreground">
            {searchQuery ? 'No results found' : 'Search for people to add'}
          </div>
        ) : (
          <ul className="divide-y">
            {people.map(person => (
              <li key={person.id} className="p-3 hover:bg-muted flex justify-between items-center">
                <div>
                  <div className="font-medium">{person.full_name}</div>
                  <div className="text-sm text-muted-foreground">{person.email}</div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => onPersonSelected(person)}>
                  <UserPlus className="h-4 w-4 mr-1" /> Add
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <Button variant="outline" className="w-full" onClick={onCreatePerson}>
        <UserPlus className="mr-2 h-4 w-4" />
        {personType === 'talent' ? 'Create New Talent' : 'Create New Contact'}
      </Button>
    </>
  );
};

export default SearchPersons;
