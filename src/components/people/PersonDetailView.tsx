
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePersonDetails } from '@/hooks/people/usePersonDetails';
import PersonHeader from './detail/PersonHeader';
import PersonBasicInfo from './detail/PersonBasicInfo';
import PersonTabsContent from './detail/PersonTabsContent';
import PersonDetailSkeleton from './detail/PersonDetailSkeleton';
import PersonNotFound from './detail/PersonNotFound';
import PersonDetailBreadcrumb from './detail/PersonDetailBreadcrumb';
import { usePersonEmploymentHistory } from '@/hooks/company-relationships/usePersonEmploymentHistory';

const PersonDetailView = () => {
  const { personId } = useParams<{ personId: string }>();
  const navigate = useNavigate();
  const { person, isLoading: isLoadingPerson, error } = usePersonDetails(personId);
  const { employmentHistory, isLoading: isLoadingHistory } = usePersonEmploymentHistory(personId);

  if (isLoadingPerson || isLoadingHistory) {
    return <PersonDetailSkeleton />;
  }

  if (error || !person) {
    return <PersonNotFound onBack={() => navigate('/people')} />;
  }

  return (
    <div className="container px-4 py-4 mx-auto max-w-7xl">
      <PersonDetailBreadcrumb person={person} />
      <PersonHeader 
        person={person} 
        currentCompany={person.current_company}
      />
      <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <PersonBasicInfo person={person} employmentHistory={employmentHistory} />
        </div>
        <div className="md:col-span-2">
          <PersonTabsContent person={person} />
        </div>
      </div>
    </div>
  );
};

export default PersonDetailView;
