
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Plus, 
  Users, 
  Briefcase, 
  Calendar, 
  TrendingUp,
  Filter,
  Download,
  Eye,
  UserCheck,
  BarChart3
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { atsService } from '@/services/atsService';
import CandidateCard from './CandidateCard';
import JobCard from './JobCard';
import ApplicationCard from './ApplicationCard';
import ATSMetrics from './ATSMetrics';
import CreateJobDialog from './CreateJobDialog';
import CreateCandidateDialog from './CreateCandidateDialog';
import TalentPoolManager from './TalentPoolManager';
import TalentMetricsDashboard from '@/components/talent/TalentMetricsDashboard';
import TalentHiringTrends from '@/components/reporting/charts/TalentHiringTrends';
import JobPostingsOverview from '@/components/reporting/charts/JobPostingsOverview';

const ATSDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Applicant Tracking System</h1>
          <p className="text-muted-foreground">
            Complete talent and recruitment management with AI-powered insights
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setCreateJobOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Job
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <ATSMetrics jobs={jobs} candidates={candidates} applications={applications} />

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search candidates, jobs, applications, or talent..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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
        </TabsContent>

        <TabsContent value="talent-pool" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Talent Pool Management</h2>
              <p className="text-sm text-muted-foreground">
                Comprehensive talent database with skills, experience, and relationship tracking
              </p>
            </div>
            <Button onClick={() => setCreateCandidateOpen(true)}>
              <UserCheck className="mr-2 h-4 w-4" />
              Add to Talent Pool
            </Button>
          </div>
          
          <TalentPoolManager searchTerm={searchTerm} />
        </TabsContent>

        <TabsContent value="candidates" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Active Candidates</h2>
            <Button onClick={() => setCreateCandidateOpen(true)}>
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
            <Button onClick={() => setCreateJobOpen(true)}>
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
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Talent Analytics</h2>
                <p className="text-sm text-muted-foreground">
                  Comprehensive talent metrics and insights
                </p>
              </div>
            </div>
            <TalentMetricsDashboard />
          </div>
        </TabsContent>

        <TabsContent value="recruiting-analytics">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Recruiting Analytics</h2>
                <p className="text-sm text-muted-foreground">
                  Hiring trends and recruitment performance metrics
                </p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Hiring Trends</CardTitle>
                  <CardDescription>Talent hiring data over time</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <TalentHiringTrends />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Job Postings</CardTitle>
                  <CardDescription>Job posting metrics</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <JobPostingsOverview />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <CreateJobDialog open={createJobOpen} onOpenChange={setCreateJobOpen} />
      <CreateCandidateDialog open={createCandidateOpen} onOpenChange={setCreateCandidateOpen} />
    </div>
  );
};

export default ATSDashboard;
