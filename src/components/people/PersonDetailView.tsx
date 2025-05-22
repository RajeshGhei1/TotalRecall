
import React, { useState } from 'react';
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
  
  // State for managing company link dialog
  const [isCompanyLinkDialogOpen, setIsCompanyLinkDialogOpen] = useState(false);
  
  // Handler for adding a new company association
  const handleAddCompany = () => {
    setIsCompanyLinkDialogOpen(true);
  };

  if (isLoadingPerson || isLoadingHistory) {
    return <PersonDetailSkeleton />;
  }

  if (error || !person) {
    return <PersonNotFound onBack={() => navigate('/people')} />;
  }

  // Find current company if it exists
  const currentCompanyRelationship = employmentHistory.find(job => job.is_current);
  const currentCompany = currentCompanyRelationship ? {
    id: currentCompanyRelationship.company.id,
    name: currentCompanyRelationship.company.name,
    role: currentCompanyRelationship.role
  } : null;

  return (
    <div className="container px-4 py-4 mx-auto max-w-7xl">
      <PersonDetailBreadcrumb person={person} />
      <PersonHeader 
        person={person} 
        onEdit={() => {/* Implement edit functionality */}}
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

      {/* Here you would add the CompanyLinkDialog component if needed */}
      {/* {isCompanyLinkDialogOpen && (
        <CompanyLinkDialog 
          isOpen={isCompanyLinkDialogOpen} 
          onClose={() => setIsCompanyLinkDialogOpen(false)}
          personId={person.id}
        />
      )} */}
    </div>
  );
};

export default PersonDetailView;
