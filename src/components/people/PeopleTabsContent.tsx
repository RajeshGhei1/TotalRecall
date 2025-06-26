
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PeopleList from './PeopleList';
import { ContactMetricsDashboard } from '@/components/contacts/ContactMetricsDashboard';
import ReportingTabContent from './tabs/ReportingTabContent';
import ReportingManager from './ReportingManager';

interface PeopleTabsContentProps {
  personType: 'talent' | 'contact';
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLinkToCompany?: (personId: string) => void;
  searchQuery?: string;
  companyFilter?: string;
}

const PeopleTabsContent: React.FC<PeopleTabsContentProps> = ({
  personType,
  activeTab,
  setActiveTab,
  onLinkToCompany,
  searchQuery,
  companyFilter,
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="list">
          {personType === 'talent' ? 'Talent List' : 'Contacts List'}
        </TabsTrigger>
        <TabsTrigger value="reporting">Reporting</TabsTrigger>
        <TabsTrigger value="manage-reporting">Manage Reporting</TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard" className="mt-6">
        {personType === 'contact' ? (
          <ContactMetricsDashboard />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Talent dashboard coming soon...
          </div>
        )}
      </TabsContent>

      <TabsContent value="list" className="mt-6">
        <PeopleList 
          personType={personType}
          searchQuery={searchQuery}
          companyFilter={companyFilter}
          onLinkToCompany={onLinkToCompany}
        />
      </TabsContent>

      <TabsContent value="reporting" className="mt-6">
        <div className="space-y-6">
          <ReportingTabContent 
            companyId="" 
            reportingType="manager"
            searchQuery={searchQuery}
          />
          <ReportingTabContent 
            companyId="" 
            reportingType="direct-report"
            searchQuery={searchQuery}
          />
        </div>
      </TabsContent>

      <TabsContent value="manage-reporting" className="mt-6">
        <ReportingManager />
      </TabsContent>
    </Tabs>
  );
};

export default PeopleTabsContent;
