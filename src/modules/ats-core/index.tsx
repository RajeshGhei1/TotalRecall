
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Briefcase, 
  UserCheck, 
  Calendar,
  TrendingUp,
  Plus,
  Search,
  Filter
} from 'lucide-react';

interface AtsCoreProps {
  view?: 'dashboard' | 'jobs' | 'candidates' | 'pipeline';
  showMetrics?: boolean;
  allowCreate?: boolean;
}

const AtsCore: React.FC<AtsCoreProps> = ({
  view = 'dashboard',
  showMetrics = true,
  allowCreate = true
}) => {
  const [activeTab, setActiveTab] = useState(view);

  const atsMetrics = [
    { label: 'Open Positions', value: '24', change: '+3', icon: Briefcase },
    { label: 'Active Candidates', value: '156', change: '+12', icon: Users },
    { label: 'Interviews Scheduled', value: '18', change: '+5', icon: Calendar },
    { label: 'Offers Extended', value: '7', change: '+2', icon: UserCheck }
  ];

  const recentJobs = [
    {
      id: '1',
      title: 'Senior Software Engineer',
      department: 'Engineering',
      location: 'San Francisco, CA',
      applications: 45,
      status: 'active',
      posted: '3 days ago'
    },
    {
      id: '2',
      title: 'Product Manager',
      department: 'Product',
      location: 'Remote',
      applications: 78,
      status: 'active',
      posted: '1 week ago'
    },
    {
      id: '3',
      title: 'UX Designer',
      department: 'Design',
      location: 'New York, NY',
      applications: 32,
      status: 'paused',
      posted: '2 weeks ago'
    }
  ];

  const recentCandidates = [
    {
      id: '1',
      name: 'Sarah Johnson',
      position: 'Senior Software Engineer',
      stage: 'Technical Interview',
      score: 92,
      applied: '2 days ago'
    },
    {
      id: '2',
      name: 'Michael Chen',
      position: 'Product Manager',
      stage: 'Final Review',
      score: 88,
      applied: '1 week ago'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      position: 'UX Designer',
      stage: 'Portfolio Review',
      score: 95,
      applied: '3 days ago'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Applied':
        return 'bg-blue-100 text-blue-800';
      case 'Phone Screen':
        return 'bg-purple-100 text-purple-800';
      case 'Technical Interview':
        return 'bg-orange-100 text-orange-800';
      case 'Final Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Portfolio Review':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {showMetrics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {atsMetrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metric.label}
                  </CardTitle>
                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">{metric.change}</span> from last week
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Job Postings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">{job.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {job.department} • {job.location}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {job.applications} applications
                      </span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCandidates.map((candidate) => (
                <div key={candidate.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">{candidate.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Applied for {candidate.position}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge className={getStageColor(candidate.stage)}>
                        {candidate.stage}
                      </Badge>
                      <span className="text-sm text-green-600 font-medium">
                        Score: {candidate.score}
                      </span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Review
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderJobs = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Job Postings</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button size="sm" variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          {allowCreate && (
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Job
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4">
        {recentJobs.map((job) => (
          <Card key={job.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{job.title}</h3>
                  <p className="text-muted-foreground">
                    {job.department} • {job.location}
                  </p>
                  <div className="flex items-center gap-4">
                    <Badge className={getStatusColor(job.status)}>
                      {job.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {job.applications} applications
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Posted {job.posted}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Edit</Button>
                  <Button>View Applications</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderCandidates = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Candidates</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button size="sm" variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {recentCandidates.map((candidate) => (
          <Card key={candidate.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{candidate.name}</h3>
                  <p className="text-muted-foreground">
                    Applied for {candidate.position}
                  </p>
                  <div className="flex items-center gap-4">
                    <Badge className={getStageColor(candidate.stage)}>
                      {candidate.stage}
                    </Badge>
                    <span className="text-sm text-green-600 font-medium">
                      AI Score: {candidate.score}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Applied {candidate.applied}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">View Profile</Button>
                  <Button>Schedule Interview</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  if (view !== 'dashboard') {
    switch (view) {
      case 'jobs':
        return renderJobs();
      case 'candidates':
        return renderCandidates();
      default:
        return renderDashboard();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">ATS Core</h1>
        <Button>
          <TrendingUp className="h-4 w-4 mr-2" />
          Analytics
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          {renderDashboard()}
        </TabsContent>

        <TabsContent value="jobs" className="mt-6">
          {renderJobs()}
        </TabsContent>

        <TabsContent value="candidates" className="mt-6">
          {renderCandidates()}
        </TabsContent>

        <TabsContent value="pipeline" className="mt-6">
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold mb-2">Pipeline View</h3>
            <p className="text-muted-foreground">Visual pipeline management coming soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Module metadata for registration
(AtsCore as any).moduleMetadata = {
  id: 'ats-core',
  name: 'ATS Core',
  category: 'recruitment',
  version: '1.0.0',
  description: 'Core Applicant Tracking System with job and candidate management',
  author: 'System',
  requiredPermissions: ['read', 'write'],
  dependencies: [],
  props: {
    view: { type: 'string', options: ['dashboard', 'jobs', 'candidates', 'pipeline'], default: 'dashboard' },
    showMetrics: { type: 'boolean', default: true },
    allowCreate: { type: 'boolean', default: true }
  }
};

export default AtsCore;
