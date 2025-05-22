
import { usePersonDetails } from '@/hooks/people/usePersonDetails';
import { usePeopleQuery } from '@/hooks/people/usePeopleQuery';
import { usePeopleMutations } from '@/hooks/people/usePeopleMutations';

export const usePeople = () => {
  const { 
    people,
    isLoading: isLoadingPeople,
    isError: isPeopleError,
    error: peopleError,
    filterPeopleBySearch,
    filterPeopleByCompany
  } = usePeopleQuery();
  
  const {
    createPerson,
    updatePerson,
    deletePerson
  } = usePeopleMutations();

  return {
    people,
    isLoadingPeople,
    isPeopleError,
    peopleError,
    filterPeopleBySearch,
    filterPeopleByCompany,
    createPerson,
    updatePerson,
    deletePerson,
    usePersonDetails // Exporting the hook directly 
  };
};
