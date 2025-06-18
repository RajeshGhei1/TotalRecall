
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { atsService } from '@/services/atsService';
import ATSMetrics from './ATSMetrics';
import CreateJobDialog from './CreateJobDialog';
import CreateCandidateDialog from './CreateCandidateDialog';
import ATSDashboardHeader from './dashboard/ATSDashboardHeader';
import ATSSearchFilters from './dashboard/ATSSearchFilters';
import ATSTabsContent from './dashboard/ATSTabsContent';

interface ATSDashboardProps {
  view?: 'dashboard' | 'jobs' | 'candidates' | 'pipeline';
  showMetrics?: boolean;
  allowCreate?: boolean;
}

const ATSDashboard: React.FC<ATSDashboardProps> = ({ 
  view = 'dashboard', 
  showMetrics = true, 
  allowCreate = true 
}) => {
  const [activeTab, setActiveTab] = useState(view === 'dashboard' ? 'overview' : view);
  const [searchTerm, setSearchTerm] = useState('');
  const [createJobOpen, setCreateJobOpen] = useState(false);
  const [createCandidateOpen, setCreateCandidateOpen] = useState(false);

  // Fetch data
  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ['ats-jobs'],
    queryFn: () => atsService.getJobs()
  });

  const { data: candidates = [], isLoading: candidatesLoading } = useQuery({
    queryKey: ['ats-candidates'],
    queryFn: () => atsService.getCandidates({ search: searchTerm })
  });

  const { data: applications = [], isLoading: applicationsLoading } = useQuery({
    queryKey: ['ats-applications'],
    queryFn: () => atsService.getApplications()
  });

  return (
    <div className="space-y-6">
      <ATSDashboardHeader onCreateJob={() => allowCreate && setCreateJobOpen(true)} />
      
      {showMetrics && (
        <ATSMetrics jobs={jobs} candidates={candidates} applications={applications} />
      )}
      
      <ATSSearchFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <ATSTabsContent
        activeTab={activeTab}
        onTabChange={setActiveTab}
        jobs={jobs}
        candidates={candidates}
        applications={applications}
        searchTerm={searchTerm}
        onCreateCandidate={() => allowCreate && setCreateCandidateOpen(true)}
        onCreateJob={() => allowCreate && setCreateJobOpen(true)}
        jobsLoading={jobsLoading}
        candidatesLoading={candidatesLoading}
        applicationsLoading={applicationsLoading}
      />

      {/* Dialogs */}
      {allowCreate && (
        <>
          <CreateJobDialog open={createJobOpen} onOpenChange={setCreateJobOpen} />
          <CreateCandidateDialog open={createCandidateOpen} onOpenChange={setCreateCandidateOpen} />
        </>
      )}
    </div>
  );
};

export default ATSDashboard;
