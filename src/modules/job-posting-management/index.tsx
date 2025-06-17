
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Briefcase, 
  Plus, 
  Settings, 
  Globe,
  Eye,
  Edit,
  Share2,
  BarChart3
} from 'lucide-react';

interface JobPostingManagementProps {
  view?: 'overview' | 'create' | 'manage' | 'analytics';
  allowMultiPosting?: boolean;
  showTemplates?: boolean;
}

const JobPostingManagement: React.FC<JobPostingManagementProps> = ({
  view = 'overview',
  allowMultiPosting = true,
  showTemplates = true
}) => {
  const [activeTab, setActiveTab] = useState(view);
  const [newJob, setNewJob] = useState({
    title: '',
    department: '',
    location: '',
    type: 'full-time',
    description: '',
    requirements: ''
  });

  const jobPostings = [
    {
      id: '1',
      title: 'Senior Software Engineer',
      department: 'Engineering',
      location: 'San Francisco, CA',
      type: 'Full-time',
      status: 'active',
      applications: 45,
      views: 234,
      posted: '3 days ago',
      platforms: ['LinkedIn', 'Indeed', 'Company Site']
    },
    {
      id: '2',
      title: 'Product Manager',
      department: 'Product',
      location: 'Remote',
      type: 'Full-time',
      status: 'active',
      applications: 78,
      views: 456,
      posted: '1 week ago',
      platforms: ['LinkedIn', 'AngelList', 'Company Site']
    },
    {
      id: '3',
      title: 'UX Designer',
      department: 'Design',
      location: 'New York, NY',
      type: 'Contract',
      status: 'paused',
      applications: 32,
      views: 189,
      posted: '2 weeks ago',
      platforms: ['Dribbble', 'Behance', 'Company Site']
    }
  ];

  const jobTemplates = [
    { id: '1', name: 'Software Engineer', category: 'Engineering', usage: 15 },
    { id: '2', name: 'Product Manager', category: 'Product', usage: 8 },
    { id: '3', name: 'Sales Representative', category: 'Sales', usage: 12 },
    { id: '4', name: 'Marketing Specialist', category: 'Marketing', usage: 6 }
  ];

  const platforms = [
    { name: 'LinkedIn', connected: true, jobs: 12 },
    { name: 'Indeed', connected: true, jobs: 8 },
    { name: 'Company Website', connected: true, jobs: 15 },
    { name: 'AngelList', connected: false, jobs: 0 },
    { name: 'Glassdoor', connected: true, jobs: 5 }
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

  const handleTabChange = (value: string) => {
    setActiveTab(value as typeof activeTab);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+3</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Job Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,456</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">16%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2%</span> from last week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Job Postings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {jobPostings.map((job) => (
                <div key={job.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{job.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {job.department} • {job.location}
                      </p>
                    </div>
                    <Badge className={getStatusColor(job.status)}>
                      {job.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <span>{job.applications} applications</span>
                    <span>{job.views} views</span>
                    <span>{job.posted}</span>
                  </div>
                  <div className="flex gap-1 mb-2">
                    {job.platforms.map((platform, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                  <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Connections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {platforms.map((platform, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <span className="font-medium">{platform.name}</span>
                      <p className="text-sm text-muted-foreground">
                        {platform.jobs} active jobs
                      </p>
                    </div>
                  </div>
                  <Badge variant={platform.connected ? 'default' : 'secondary'}>
                    {platform.connected ? 'Connected' : 'Disconnected'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderCreate = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Job Posting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Job Title</label>
                <Input
                  value={newJob.title}
                  onChange={(e) => setNewJob(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Senior Software Engineer"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Department</label>
                <Input
                  value={newJob.department}
                  onChange={(e) => setNewJob(prev => ({ ...prev, department: e.target.value }))}
                  placeholder="e.g. Engineering"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Location</label>
                <Input
                  value={newJob.location}
                  onChange={(e) => setNewJob(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g. San Francisco, CA or Remote"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Employment Type</label>
                <select 
                  value={newJob.type}
                  onChange={(e) => setNewJob(prev => ({ ...prev, type: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Job Description</label>
              <Textarea
                value={newJob.description}
                onChange={(e) => setNewJob(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                rows={4}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Requirements</label>
              <Textarea
                value={newJob.requirements}
                onChange={(e) => setNewJob(prev => ({ ...prev, requirements: e.target.value }))}
                placeholder="List the required skills, experience, and qualifications..."
                rows={3}
              />
            </div>

            {allowMultiPosting && (
              <div>
                <label className="text-sm font-medium mb-2 block">Post to Platforms</label>
                <div className="grid gap-2 md:grid-cols-3">
                  {platforms.filter(p => p.connected).map((platform, index) => (
                    <label key={index} className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">{platform.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Job
              </Button>
              <Button variant="outline">Save as Draft</Button>
              {showTemplates && (
                <Button variant="outline">Save as Template</Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {showTemplates && (
        <Card>
          <CardHeader>
            <CardTitle>Job Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {jobTemplates.map((template) => (
                <div key={template.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{template.name}</h4>
                    <Badge variant="secondary">{template.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Used {template.usage} times
                  </p>
                  <Button size="sm" variant="outline">
                    Use Template
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderManage = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Manage Job Postings</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Bulk Actions
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Job
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {jobPostings.map((job) => (
          <Card key={job.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold">{job.title}</h3>
                    <Badge className={getStatusColor(job.status)}>
                      {job.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    {job.department} • {job.location} • {job.type}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{job.applications} applications</span>
                    <span>{job.views} views</span>
                    <span>Posted {job.posted}</span>
                  </div>
                  <div className="flex gap-1">
                    {job.platforms.map((platform, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button size="sm">
                    View Applications
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  if (view !== 'overview') {
    switch (view) {
      case 'create':
        return renderCreate();
      case 'manage':
        return renderManage();
      default:
        return renderOverview();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Job Posting Management</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Job
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="create">Create</TabsTrigger>
          <TabsTrigger value="manage">Manage</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          {renderOverview()}
        </TabsContent>

        <TabsContent value="create" className="mt-6">
          {renderCreate()}
        </TabsContent>

        <TabsContent value="manage" className="mt-6">
          {renderManage()}
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold mb-2">Job Posting Analytics</h3>
            <p className="text-muted-foreground">Detailed analytics and performance metrics coming soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Module metadata for registration
(JobPostingManagement as any).moduleMetadata = {
  id: 'job-posting-management',
  name: 'Job Posting Management',
  category: 'recruitment',
  version: '1.0.0',
  description: 'Comprehensive job posting management with multi-platform publishing and templates',
  author: 'System',
  requiredPermissions: ['read', 'write'],
  dependencies: ['ats-core'],
  props: {
    view: { type: 'string', options: ['overview', 'create', 'manage', 'analytics'], default: 'overview' },
    allowMultiPosting: { type: 'boolean', default: true },
    showTemplates: { type: 'boolean', default: true }
  }
};

export default JobPostingManagement;
