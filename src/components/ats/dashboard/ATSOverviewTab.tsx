
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Briefcase } from 'lucide-react';
import { Job, Application } from '@/types/ats';
import ApplicationCard from '../ApplicationCard';
import JobCard from '../JobCard';

interface ATSOverviewTabProps {
  jobs: Job[];
  applications: Application[];
}

const ATSOverviewTab = ({ jobs, applications }: ATSOverviewTabProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            Recent Applications
          </CardTitle>
          <CardDescription>Latest candidate applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {applications.slice(0, 5).map(application => (
              <ApplicationCard key={application.id} application={application} compact />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Jobs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Briefcase className="mr-2 h-5 w-5" />
            Active Jobs
          </CardTitle>
          <CardDescription>Currently open positions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {jobs.filter(job => job.status === 'active').slice(0, 5).map(job => (
              <JobCard key={job.id} job={job} compact />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ATSOverviewTab;
