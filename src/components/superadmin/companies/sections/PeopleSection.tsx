
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CompanyFormValues } from '../schema';
import CompanyPeopleManager from '@/components/people/CompanyPeopleManager';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useCompanyRelationships } from '@/hooks/company-relationships/useCompanyRelationships';
import { QueryErrorDisplay } from '@/components/ui/error-display';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import PeopleTabsContainer from './people/PeopleTabsContainer';
import PeopleRelationshipList from './people/PeopleRelationshipList';

interface PeopleSectionProps {
  form: UseFormReturn<CompanyFormValues>;
  showFullView?: boolean;
}

const PeopleSection: React.FC<PeopleSectionProps> = ({ form, showFullView = false }) => {
  const formValues = form.getValues();
  const companyId = formValues.id ?? 'new';
  
  const [activeTab, setActiveTab] = useState('current');
  const { data: relationships, isLoading, error } = useCompanyRelationships(companyId);
  
  // Filter relationships by current and past
  const currentRelationships = relationships?.filter(rel => rel.is_current) || [];
  const pastRelationships = relationships?.filter(rel => !rel.is_current) || [];

  const handleRetry = () => {
    window.location.reload();
  };
  
  if (showFullView) {
    return (
      <ErrorBoundary>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>People Associated with Company</CardTitle>
            <CardDescription>Manage and view all people associated with this company</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <QueryErrorDisplay
                error={error}
                onRetry={handleRetry}
                entityName="company relationships"
                className="mb-4"
              />
            )}
            
            <PeopleTabsContainer
              activeTab={activeTab}
              onTabChange={setActiveTab}
              currentRelationships={currentRelationships}
              pastRelationships={pastRelationships}
              companyId={companyId}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </ErrorBoundary>
    );
  }
  
  // Simple view for the company form
  return (
    <ErrorBoundary>
      <CompanyPeopleManager companyId={companyId} />
    </ErrorBoundary>
  );
};

export default PeopleSection;
