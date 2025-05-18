
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from "@/components/ui/input";
import { Search, Trash2, Plus, UserPlus } from "lucide-react";
import { CompanyFormValues } from '../schema';

interface PeopleSectionProps {
  form: UseFormReturn<CompanyFormValues>;
}

type PersonType = 'talent' | 'contact';

interface Person {
  id: string;
  full_name: string;
  email: string;
  role?: string;
  type: PersonType;
}

const PeopleSection: React.FC<PeopleSectionProps> = ({ form }) => {
  const [personType, setPersonType] = useState<PersonType>('contact');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeople, setSelectedPeople] = useState<Person[]>([]);
  
  // Mock data for talents and contacts - in a real implementation, this would come from API
  const mockTalents: Person[] = [
    { id: 't1', full_name: 'John Doe', email: 'john@example.com', type: 'talent' },
    { id: 't2', full_name: 'Jane Smith', email: 'jane@example.com', type: 'talent' },
    { id: 't3', full_name: 'Michael Johnson', email: 'michael@example.com', type: 'talent' },
  ];

  const mockContacts: Person[] = [
    { id: 'c1', full_name: 'Alice Brown', email: 'alice@example.com', type: 'contact' },
    { id: 'c2', full_name: 'Bob Williams', email: 'bob@example.com', type: 'contact' },
    { id: 'c3', full_name: 'Charlie Davis', email: 'charlie@example.com', type: 'contact' },
  ];

  // Filter people based on search query
  const filteredPeople = personType === 'talent'
    ? mockTalents.filter(p => 
        p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.email.toLowerCase().includes(searchQuery.toLowerCase()))
    : mockContacts.filter(p => 
        p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.email.toLowerCase().includes(searchQuery.toLowerCase()));

  // Add person to the selected people list
  const addPerson = (person: Person) => {
    if (!selectedPeople.some(p => p.id === person.id)) {
      const personWithRole = { ...person, role: '' };
      setSelectedPeople([...selectedPeople, personWithRole]);
    }
  };

  // Remove person from the selected people list
  const removePerson = (personId: string) => {
    setSelectedPeople(selectedPeople.filter(p => p.id !== personId));
  };

  // Update person's role
  const updatePersonRole = (personId: string, role: string) => {
    setSelectedPeople(
      selectedPeople.map(p => 
        p.id === personId ? { ...p, role } : p
      )
    );
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
                  <Button variant="ghost" size="icon" onClick={() => removePerson(person.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Person selector */}
      <div className="border rounded-md p-4 space-y-4">
        <Tabs value={personType} onValueChange={(value) => setPersonType(value as PersonType)} className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="talent">Add Talent</TabsTrigger>
            <TabsTrigger value="contact">Add Business Contact</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder={`Search ${personType === 'talent' ? 'talent' : 'business contacts'}...`}
            className="pl-8" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="max-h-60 overflow-y-auto border rounded-md">
          {filteredPeople.length === 0 ? (
            <div className="text-center p-4 text-muted-foreground">
              No {personType === 'talent' ? 'talent' : 'contacts'} found matching your search
            </div>
          ) : (
            <ul className="divide-y">
              {filteredPeople.map(person => (
                <li key={person.id} className="p-3 hover:bg-muted flex justify-between items-center">
                  <div>
                    <div className="font-medium">{person.full_name}</div>
                    <div className="text-sm text-muted-foreground">{person.email}</div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => addPerson(person)}>
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <Button variant="outline" className="w-full">
          <UserPlus className="mr-2 h-4 w-4" />
          {personType === 'talent' ? 'Create New Talent' : 'Create New Contact'}
        </Button>
      </div>
    </div>
  );
};

export default PeopleSection;
