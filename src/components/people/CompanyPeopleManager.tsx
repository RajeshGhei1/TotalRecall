
import React, { useState, useEffect } from 'react';
import { useCompanyPeopleRelationship } from '@/hooks/useCompanyPeopleRelationship';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Trash2, UserPlus, Building } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Person {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  type: 'talent' | 'contact';
}

interface CompanyPeopleManagerProps {
  companyId: string;
}

const CompanyPeopleManager: React.FC<CompanyPeopleManagerProps> = ({ companyId }) => {
  const [personType, setPersonType] = useState<'talent' | 'contact'>('contact');
  const [searchQuery, setSearchQuery] = useState('');
  const [people, setPeople] = useState<Person[]>([]);
  const [selectedPeople, setSelectedPeople] = useState<(Person & { role?: string })[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { relationships, createRelationship } = useCompanyPeopleRelationship(companyId);
  
  // Load existing relationships when component mounts
  useEffect(() => {
    if (relationships) {
      // Since we're having issues with the relationship, let's fetch people separately
      const loadPeopleForRelationships = async () => {
        const personIds = relationships.map(rel => rel.person_id);
        if (personIds.length === 0) return;
        
        const { data } = await supabase
          .from('people')
          .select('*')
          .in('id', personIds);
        
        if (data) {
          const peopleMap = new Map(data.map(p => [p.id, p]));
          
          const existingPeople = relationships.map(rel => {
            const person = peopleMap.get(rel.person_id);
            if (!person) return null;
            
            return {
              id: person.id,
              full_name: person.full_name,
              email: person.email,
              phone: person.phone,
              type: person.type as 'talent' | 'contact',
              role: rel.role
            };
          }).filter(Boolean) as (Person & { role: string })[];
          
          setSelectedPeople(existingPeople);
        }
      };
      
      loadPeopleForRelationships();
    }
  }, [relationships]);

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

  const addPerson = (person: Person) => {
    if (!selectedPeople.some(p => p.id === person.id)) {
      const personWithRole = { ...person, role: '' };
      setSelectedPeople([...selectedPeople, personWithRole]);
    }
  };

  const removePerson = (personId: string) => {
    setSelectedPeople(selectedPeople.filter(p => p.id !== personId));
  };

  const updatePersonRole = (personId: string, role: string) => {
    setSelectedPeople(
      selectedPeople.map(p => 
        p.id === personId ? { ...p, role } : p
      )
    );
  };

  const handleLinkPerson = async (person: Person & { role?: string }) => {
    if (!person.role) {
      toast.error('Please provide a role for this person');
      return;
    }
    
    try {
      await createRelationship.mutateAsync({
        person_id: person.id,
        company_id: companyId,
        role: person.role || '',
        relationship_type: person.type === 'talent' ? 'employment' : 'business_contact',
        start_date: new Date().toISOString().split('T')[0],
        is_current: true
      });
    } catch (error) {
      console.error('Error linking person:', error);
    }
  };

  const createNewPerson = async () => {
    // This would open a dialog to create a new person
    toast.info(`Create new ${personType} feature will be implemented soon`);
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Add people who are associated with this company. This will create a relationship record, 
          and people can be assigned to multiple companies over time.
        </p>
      </div>

      {/* Selected People List */}
      <div className="space-y-4">
        <h4 className="font-medium">People associated with this company:</h4>
        {selectedPeople.length === 0 ? (
          <div className="text-center p-4 border rounded-md text-muted-foreground">
            No people are currently associated with this company
          </div>
        ) : (
          <div className="space-y-2">
            {selectedPeople.map(person => (
              <div key={person.id} className="flex items-center justify-between border p-3 rounded-md">
                <div>
                  <div className="font-medium">{person.full_name}</div>
                  <div className="text-sm text-muted-foreground">{person.email}</div>
                  <div className="text-xs text-muted-foreground">
                    {person.type === 'talent' ? 'Talent' : 'Business Contact'}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Input 
                    placeholder="Role in company" 
                    className="w-48"
                    value={person.role || ''}
                    onChange={(e) => updatePersonRole(person.id, e.target.value)}
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removePerson(person.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                  {!relationships?.some(rel => rel.person_id === person.id) && (
                    <Button 
                      size="sm" 
                      onClick={() => handleLinkPerson(person)}
                    >
                      <Building className="h-4 w-4 mr-1" /> Link
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Person selector */}
      <div className="border rounded-md p-4 space-y-4">
        <Tabs value={personType} onValueChange={(value) => setPersonType(value as 'talent' | 'contact')} className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="talent">Add Talent</TabsTrigger>
            <TabsTrigger value="contact">Add Business Contact</TabsTrigger>
          </TabsList>
        </Tabs>

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
                  <Button variant="ghost" size="sm" onClick={() => addPerson(person)}>
                    <UserPlus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <Button variant="outline" className="w-full" onClick={createNewPerson}>
          <UserPlus className="mr-2 h-4 w-4" />
          {personType === 'talent' ? 'Create New Talent' : 'Create New Contact'}
        </Button>
      </div>
    </div>
  );
};

export default CompanyPeopleManager;
