
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePersonQuery } from '@/hooks/people/usePersonQuery';
import { QueryErrorDisplay } from '@/components/ui/error-display';
import { ErrorBoundary } from '@/components/ui/error-boundary';
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
  const { data: person, isLoading: isLoadingPerson, error: personError } = usePersonQuery(personId);
  const { employmentHistory, isLoading: isLoadingHistory, error: historyError } = usePersonEmploymentHistory(personId);
  const [isCompanyLinkOpen, setIsCompanyLinkOpen] = useState(false);

  const handleRetry = () => {
    window.location.reload();
  };

  if (isLoadingPerson || isLoadingHistory) {
    return <PersonDetailSkeleton />;
  }

  if (personError) {
    return (
      <div className="container px-4 py-4 mx-auto max-w-7xl">
        <QueryErrorDisplay
          error={personError}
          onRetry={handleRetry}
          entityName="person details"
          className="my-8"
        />
      </div>
    );
  }

  if (!person) {
    return <PersonNotFound onBack={() => navigate('/superadmin/people')} />;
  }

  const handleAddCompany = () => {
    setIsCompanyLinkOpen(true);
  };

  const handleCloseCompanyLink = () => {
    setIsCompanyLinkOpen(false);
  };

  return (
    <ErrorBoundary>
      <div className="container px-4 py-4 mx-auto max-w-7xl">
        <PersonDetailBreadcrumb person={person} />
        <PersonHeader 
          person={person} 
          currentCompany={person.current_company}
        />
        
        {historyError && (
          <QueryErrorDisplay
            error={historyError}
            onRetry={handleRetry}
            entityName="employment history"
            className="my-4"
          />
        )}
        
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
              handleCloseCompanyLink();
            }}
            companies={[]}
            personType={person.type}
            personId={person.id}
            isSubmitting={false}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default PersonDetailView;
