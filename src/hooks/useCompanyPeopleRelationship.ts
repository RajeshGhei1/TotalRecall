
import { useCompanyRelationshipMutations } from './company-relationships/useCompanyRelationshipMutations';
import { useCompanyRelationships } from './company-relationships/useCompanyRelationships';
import { usePersonEmploymentHistory } from './company-relationships/usePersonEmploymentHistory';
import { usePersonReportingRelationships } from './company-relationships/usePersonReportingRelationships';

export const useCompanyPeopleRelationship = (companyId?: string) => {
  const { linkPersonToCompany, createRelationship } = useCompanyRelationshipMutations();
  const { data: relationships } = useCompanyRelationships(companyId);
  const { getPersonEmploymentHistory } = usePersonEmploymentHistory();

  return {
    linkPersonToCompany,
    createRelationship,
    relationships,
    getPersonEmploymentHistory,
    usePersonEmploymentHistory,
    usePersonReportingRelationships
  };
};
