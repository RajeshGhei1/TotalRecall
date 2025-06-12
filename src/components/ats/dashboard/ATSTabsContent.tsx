
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ATSJobsTab from './ATSJobsTab';
import ATSCandidatesTab from './ATSCandidatesTab';
import ATSApplicationsTab from './ATSApplicationsTab';
import ATSAnalyticsTab from './ATSAnalyticsTab';

interface ATSTabsContentProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  jobs: any[];
  candidates: any[];
  applications: any[];
  searchTerm: string;
  onCreateCandidate: () => void;
  onCreateJob: () => void;
  jobsLoading: boolean;
  candidatesLoading: boolean;
  applicationsLoading: boolean;
}

const ATSTabsContent = ({
  activeTab,
  onTabChange,
  jobs,
  candidates,
  applications,
  searchTerm,
  onCreateCandidate,
  onCreateJob,
  jobsLoading,
  candidatesLoading,
  applicationsLoading
}: ATSTabsContentProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-4">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="jobs">Jobs</TabsTrigger>
        <TabsTrigger value="candidates">Candidates</TabsTrigger>
        <TabsTrigger value="applications">Applications</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium">ATS Overview</h3>
          <p className="text-muted-foreground">
            Welcome to the Applicant Tracking System. Use the tabs above to navigate between different sections.
          </p>
        </div>
      </TabsContent>

      <TabsContent value="jobs">
        <ATSJobsTab 
          jobs={jobs}
          searchTerm={searchTerm}
          onCreateJob={onCreateJob}
          loading={jobsLoading}
        />
      </TabsContent>

      <TabsContent value="candidates">
        <ATSCandidatesTab 
          candidates={candidates}
          searchTerm={searchTerm}
          onCreateCandidate={onCreateCandidate}
          loading={candidatesLoading}
        />
      </TabsContent>

      <TabsContent value="applications">
        <ATSApplicationsTab 
          applications={applications}
          loading={applicationsLoading}
        />
      </TabsContent>

      <TabsContent value="analytics">
        <div className="space-y-6">
          <ATSAnalyticsTab type="talent" />
          <ATSAnalyticsTab type="recruiting" />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ATSTabsContent;
