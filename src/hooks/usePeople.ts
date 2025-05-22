
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

  // Extract filterPeopleBySearch and filterPeopleByCompany from queryRest if they exist
  const filterPeopleBySearch = queryRest.filterPeopleBySearch;
  const filterPeopleByCompany = queryRest.filterPeopleByCompany;

  return {
    people,
    isLoadingPeople,
    isPeopleError,
    peopleError,
    filterPeopleBySearch,
    filterPeopleByCompany,
    createPerson,
    deletePerson,
    usePersonDetails, // Exporting the hook directly 
  };
};
