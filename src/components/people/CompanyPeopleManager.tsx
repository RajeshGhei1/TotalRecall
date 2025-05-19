
import React, { useState, useEffect } from 'react';
import { useCompanyPeopleRelationship } from '@/hooks/useCompanyPeopleRelationship';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import CreatePersonDialog from './CreatePersonDialog';
import { Person } from '@/types/person';
import { CompanyPeopleManagerProps, PersonWithRole } from './companyPeople/types';
import SearchPersons from './companyPeople/SearchPersons';
import SelectedPeopleList from './companyPeople/SelectedPeopleList';

const CompanyPeopleManager: React.FC<CompanyPeopleManagerProps> = ({ companyId }) => {
  const [personType, setPersonType] = useState<'talent' | 'contact'>('contact');
  const [selectedPeople, setSelectedPeople] = useState<PersonWithRole[]>([]);
  const [isCreatePersonDialogOpen, setIsCreatePersonDialogOpen] = useState(false);
  
  const { linkPersonToCompany, relationships, createRelationship } = useCompanyPeopleRelationship(companyId);
  
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
              role: rel.role,
              location: person.location
            };
          }).filter(Boolean) as PersonWithRole[];
          
          setSelectedPeople(existingPeople);
        }
      };
      
      loadPeopleForRelationships();
    }
  }, [relationships]);

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

  const handleLinkPerson = async (person: PersonWithRole) => {
    if (!person.role) {
      toast.error('Please provide a role for this person');
      return;
    }
    
    try {
      await linkPersonToCompany.mutateAsync({
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

  const handleCreatePerson = () => {
    setIsCreatePersonDialogOpen(true);
  };

  const handlePersonCreated = () => {
    setIsCreatePersonDialogOpen(false);
  };

  const linkedPersonIds = relationships ? relationships.map(rel => rel.person_id) : [];

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
        <SelectedPeopleList
          people={selectedPeople}
          onRemove={removePerson}
          onUpdateRole={updatePersonRole}
          onLink={handleLinkPerson}
          linkedPersonIds={linkedPersonIds}
        />
      </div>

      {/* Person selector */}
      <div className="border rounded-md p-4 space-y-4">
        <Tabs value={personType} onValueChange={(value) => setPersonType(value as 'talent' | 'contact')} className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="talent">Add Talent</TabsTrigger>
            <TabsTrigger value="contact">Add Business Contact</TabsTrigger>
          </TabsList>
        </Tabs>

        <SearchPersons
          personType={personType}
          onPersonSelected={addPerson}
          onCreatePerson={handleCreatePerson}
        />
      </div>
      
      {/* Create person dialog */}
      <CreatePersonDialog
        isOpen={isCreatePersonDialogOpen}
        onClose={() => setIsCreatePersonDialogOpen(false)}
        onSuccess={handlePersonCreated}
        personType={personType}
      />
    </div>
  );
};

export default CompanyPeopleManager;
