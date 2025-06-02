
import { usePeopleQuery } from './people/usePeopleQuery';
import { usePeopleMutations } from './people/usePeopleMutations';
import { usePersonDetails } from './people/usePersonDetails';
import { Person } from '@/types/person';

export const usePeople = (
  personType?: 'talent' | 'contact', 
  searchQuery?: string, 
  companyFilter?: string,
  context?: 'superadmin' | 'tenant'
) => {
  // In Super Admin context, force personType to 'contact' only
  const effectivePersonType = context === 'superadmin' ? 'contact' : personType;
  
  const { 
    data: people = [], 
    isLoading, 
    isError, 
    error 
  } = usePeopleQuery(effectivePersonType, searchQuery, companyFilter);
  
  const { createPerson, deletePerson } = usePeopleMutations(effectivePersonType);
  const { getPersonById } = usePersonDetails();

  return {
    people,
    isLoading,
    isError,
    error,
    createPerson,
    deletePerson,
    getPersonById
  };
};

export type { Person };
export type { CreatePersonData } from '@/types/person';
