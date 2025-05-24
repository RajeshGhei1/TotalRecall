
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import PeopleRelationshipList from './PeopleRelationshipList';
import CompanyOrgChart from '../../charts/CompanyOrgChart';
import CompanyPeopleManager from '@/components/people/CompanyPeopleManager';

interface PeopleTabsContainerProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  currentRelationships: any[];
  pastRelationships: any[];
  companyId: string;
  isLoading: boolean;
}

const PeopleTabsContainer: React.FC<PeopleTabsContainerProps> = ({
  activeTab,
  onTabChange,
  currentRelationships,
  pastRelationships,
  companyId,
  isLoading
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="current">Current People ({currentRelationships.length})</TabsTrigger>
        <TabsTrigger value="past">Past Associations ({pastRelationships.length})</TabsTrigger>
        <TabsTrigger value="org-chart">Organization Chart</TabsTrigger>
        <TabsTrigger value="manage">Manage Associations</TabsTrigger>
      </TabsList>
      
      <ErrorBoundary>
        <TabsContent value="current">
          <div className="space-y-4">
            {currentRelationships.length > 0 ? (
              <PeopleRelationshipList relationships={currentRelationships} />
            ) : (
              <div className="text-center p-4 text-muted-foreground rounded-md border">
                No current people associated with this company
              </div>
            )}
          </div>
        </TabsContent>
      </ErrorBoundary>
      
      <ErrorBoundary>
        <TabsContent value="past">
          <div className="space-y-4">
            {pastRelationships.length > 0 ? (
              <PeopleRelationshipList relationships={pastRelationships} />
            ) : (
              <div className="text-center p-4 text-muted-foreground rounded-md border">
                No past associations found
              </div>
            )}
          </div>
        </TabsContent>
      </ErrorBoundary>
      
      <ErrorBoundary>
        <TabsContent value="org-chart">
          {companyId !== 'new' ? (
            <CompanyOrgChart companyId={companyId} />
          ) : (
            <div className="text-center p-4 text-muted-foreground rounded-md border">
              Save the company first to view the organization chart
            </div>
          )}
        </TabsContent>
      </ErrorBoundary>
      
      <ErrorBoundary>
        <TabsContent value="manage">
          <CompanyPeopleManager companyId={companyId} />
        </TabsContent>
      </ErrorBoundary>
    </Tabs>
  );
};

export default PeopleTabsContainer;
