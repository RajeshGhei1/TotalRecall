
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import PeopleList from './PeopleList';
import ContactMetricsDashboard from '@/components/contacts/ContactMetricsDashboard';
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
        <TabsTrigger value="manage-reporting" className="bg-blue-50">
          Manage Reporting
        </TabsTrigger>
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
        <div className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Use this section to set up reporting relationships between contacts. 
              Select a manager for each contact to establish the organizational hierarchy.
            </AlertDescription>
          </Alert>
          <ReportingManager />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default PeopleTabsContent;
