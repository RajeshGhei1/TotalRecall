
import { usePeopleQuery } from './people/usePeopleQuery';
import { usePeopleMutations } from './people/usePeopleMutations';
import { usePersonDetails } from './people/usePersonDetails';
import { Person } from '@/types/person';

export const usePeople = (
  personType?: 'talent' | 'contact', 
  searchQuery?: string, 
  companyFilter?: string
) => {
  const { 
    data: people = [], 
    isLoading, 
    isError, 
    error 
  } = usePeopleQuery(personType, searchQuery, companyFilter);
  
  const { createPerson, deletePerson } = usePeopleMutations(personType);
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
