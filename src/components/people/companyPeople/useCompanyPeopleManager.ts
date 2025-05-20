
import { useState, useEffect } from 'react';
import { useCompanyPeopleRelationship } from '@/hooks/useCompanyPeopleRelationship';
import { supabase } from '@/integrations/supabase/client';
import { Person } from '@/types/person';
import { PersonWithRole } from './types';

export const useCompanyPeopleManager = (companyId: string) => {
  const [selectedPeople, setSelectedPeople] = useState<PersonWithRole[]>([]);
  const { linkPersonToCompany, relationships } = useCompanyPeopleRelationship(companyId);
  
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
              location: person.location,
              created_at: person.created_at,
              updated_at: person.updated_at
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

  // Generate the list of already linked person IDs
  const linkedPersonIds = relationships ? relationships.map(rel => rel.person_id) : [];

  return {
    selectedPeople,
    setSelectedPeople,
    linkedPersonIds,
    addPerson,
    removePerson,
    updatePersonRole,
    handleLinkPerson
  };
};
