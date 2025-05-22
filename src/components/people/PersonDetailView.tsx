
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePersonQuery } from '@/hooks/people/usePersonQuery';
import PersonHeader from './detail/PersonHeader';
import PersonBasicInfo from './detail/PersonBasicInfo';
import PersonTabsContent from './detail/PersonTabsContent';
import PersonDetailSkeleton from './detail/PersonDetailSkeleton';
import PersonNotFound from './detail/PersonNotFound';
import PersonDetailBreadcrumb from './detail/PersonDetailBreadcrumb';
import { usePersonEmploymentHistory } from '@/hooks/company-relationships/usePersonEmploymentHistory';
import { CompanyLinkForm } from './companyLink';

const PersonDetailView = () => {
  const { personId } = useParams<{ personId: string }>();
  const navigate = useNavigate();
  const { data: person, isLoading: isLoadingPerson, error } = usePersonQuery(personId);
  const { employmentHistory, isLoading: isLoadingHistory } = usePersonEmploymentHistory(personId);
  const [isCompanyLinkOpen, setIsCompanyLinkOpen] = useState(false);

  if (isLoadingPerson || isLoadingHistory) {
    return <PersonDetailSkeleton />;
  }

  if (error || !person) {
    return <PersonNotFound onBack={() => navigate('/people')} />;
  }

  const handleAddCompany = () => {
    setIsCompanyLinkOpen(true);
  };

  const handleCloseCompanyLink = () => {
    setIsCompanyLinkOpen(false);
  };

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
          <PersonTabsContent 
            person={person} 
            employmentHistory={employmentHistory}
            loadingHistory={isLoadingHistory}
            onAddCompany={handleAddCompany}
          />
        </div>
      </div>
      
      {isCompanyLinkOpen && (
        <CompanyLinkForm
          isOpen={isCompanyLinkOpen}
          onClose={handleCloseCompanyLink}
          onSubmit={() => {
            // We'll refetch the employment history after submission
            handleCloseCompanyLink();
          }}
          companies={[]} // This would come from a hook or prop
          personType={person.type}
          personId={person.id}
          isSubmitting={false}
        />
      )}
    </div>
  );
};

export default PersonDetailView;
