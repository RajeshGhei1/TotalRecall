
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ATSJobsTab from './ATSJobsTab';
import ATSCandidatesTab from './ATSCandidatesTab';
import ATSApplicationsTab from './ATSApplicationsTab';
import ATSAnalyticsTab from './ATSAnalyticsTab';

// Define types to match the tab components
interface Job {
  id: string;
  title?: string;
  department?: string;
  location?: string;
  employment_type?: string;
  status?: 'open' | 'closed' | 'draft';
  applications_count?: number;
  created_at?: string;
}

interface Candidate {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  location?: string;
  current_title?: string;
  status?: string;
}

interface Application {
  id: string;
  candidate_name?: string;
  job_title?: string;
  status?: 'new' | 'reviewing' | 'interviewing' | 'hired' | 'rejected';
  stage?: string;
  created_at?: string;
}

interface ATSTabsContentProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  jobs: Job[];
  candidates: Candidate[];
  applications: Application[];
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
