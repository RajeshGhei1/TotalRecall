
import { usePersonDetails } from '@/hooks/people/usePersonDetails';
import { usePeopleQuery } from '@/hooks/people/usePeopleQuery';
import { usePeopleMutations } from '@/hooks/people/usePeopleMutations';
import { Person } from '@/types/person';

export const usePeople = (
  personType?: 'talent' | 'contact',
  searchQuery?: string,
  companyFilter?: string
) => {
  const { 
    data: people = [],
    isLoading: isLoadingPeople,
    isError: isPeopleError,
    error: peopleError,
    ...queryRest
  } = usePeopleQuery(personType, searchQuery, companyFilter);
  
  const {
    createPerson,
    deletePerson,
    ...mutationRest
  } = usePeopleMutations(personType);

  // We won't try to extract these properties anymore since they don't exist
  // in the returned object from usePeopleQuery
  
  return {
    people,
    isLoadingPeople,
    isPeopleError,
    peopleError,
    // Remove these properties since they don't exist
    // filterPeopleBySearch,
    // filterPeopleByCompany,
    createPerson,
    deletePerson,
    usePersonDetails, // Exporting the hook directly 
  };
};
