
import React, { useState, useEffect } from 'react';
import { useCompanyPeopleRelationship } from '@/hooks/useCompanyPeopleRelationship';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CreatePersonDialog } from '@/components/people/personForm';
import { Person } from '@/types/person';
import { CompanyPeopleManagerProps, PersonWithRole } from './companyPeople/types';
import SearchPersons from './companyPeople/SearchPersons';
import SelectedPeopleList from './companyPeople/SelectedPeopleList';
import { useCompanyPeopleManager } from './companyPeople/useCompanyPeopleManager';

const CompanyPeopleManager: React.FC<CompanyPeopleManagerProps> = ({ companyId }) => {
  const [personType, setPersonType] = useState<'talent' | 'contact'>('contact');
  const [isCreatePersonDialogOpen, setIsCreatePersonDialogOpen] = useState(false);
  
  const { 
    selectedPeople,
    setSelectedPeople,
    linkedPersonIds,
    addPerson,
    removePerson,
    updatePersonRole,
    handleLinkPerson
  } = useCompanyPeopleManager(companyId);

  const handleCreatePerson = () => {
    setIsCreatePersonDialogOpen(true);
  };

  const handlePersonCreated = () => {
    setIsCreatePersonDialogOpen(false);
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
