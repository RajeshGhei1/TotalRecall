
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  UserCheck,
  Eye,
  Calendar,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { Job, Candidate, Application } from '@/types/ats';
import CandidateCard from '../CandidateCard';
import JobCard from '../JobCard';
import ApplicationCard from '../ApplicationCard';
import TalentPoolManager from '../TalentPoolManager';
import ATSOverviewTab from './ATSOverviewTab';
import ATSAnalyticsTab from './ATSAnalyticsTab';

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
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-6">
      <TabsList className="grid w-full grid-cols-7">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="talent-pool">
          Talent Pool
          <Badge variant="secondary" className="ml-2">
            {candidates.length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="candidates">
          Active Candidates
          <Badge variant="secondary" className="ml-2">
            {candidates.filter(c => c.tags?.includes('active')).length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="jobs">
          Jobs
          <Badge variant="secondary" className="ml-2">
            {jobs.filter(j => j.status === 'active').length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="applications">
          Applications
          <Badge variant="secondary" className="ml-2">
            {applications.length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="talent-analytics">
          <BarChart3 className="mr-2 h-4 w-4" />
          Talent Analytics
        </TabsTrigger>
        <TabsTrigger value="recruiting-analytics">
          <TrendingUp className="mr-2 h-4 w-4" />
          Recruiting Analytics
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <ATSOverviewTab jobs={jobs} applications={applications} />
      </TabsContent>

      <TabsContent value="talent-pool" className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Talent Pool Management</h2>
            <p className="text-sm text-muted-foreground">
              Comprehensive talent database with skills, experience, and relationship tracking
            </p>
          </div>
          <Button onClick={onCreateCandidate}>
            <UserCheck className="mr-2 h-4 w-4" />
            Add to Talent Pool
          </Button>
        </div>
        
        <TalentPoolManager searchTerm={searchTerm} />
      </TabsContent>

      <TabsContent value="candidates" className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Active Candidates</h2>
          <Button onClick={onCreateCandidate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Candidate
          </Button>
        </div>
        
        {candidatesLoading ? (
          <div className="text-center py-12">Loading candidates...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.filter(c => c.tags?.includes('active')).map(candidate => (
              <CandidateCard key={candidate.id} candidate={candidate} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="jobs" className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Jobs</h2>
          <Button onClick={onCreateJob}>
            <Plus className="mr-2 h-4 w-4" />
            Create Job
          </Button>
        </div>
        
        {jobsLoading ? (
          <div className="text-center py-12">Loading jobs...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {jobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="applications" className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Applications</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              Pipeline View
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Interview
            </Button>
          </div>
        </div>
        
        {applicationsLoading ? (
          <div className="text-center py-12">Loading applications...</div>
        ) : (
          <div className="space-y-4">
            {applications.map(application => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="talent-analytics">
        <ATSAnalyticsTab type="talent" />
      </TabsContent>

      <TabsContent value="recruiting-analytics">
        <ATSAnalyticsTab type="recruiting" />
      </TabsContent>
    </Tabs>
  );
};

export default ATSTabsContent;
