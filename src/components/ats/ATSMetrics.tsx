
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  Calendar,
  Target,
  Clock
} from 'lucide-react';
import { Job, Candidate, Application } from '@/types/ats';

interface ATSMetricsProps {
  jobs: Job[];
  candidates: Candidate[];
  applications: Application[];
}

const ATSMetrics = ({ jobs, candidates, applications }: ATSMetricsProps) => {
  const activeJobs = jobs.filter(job => job.status === 'active');
  const newApplicationsThisWeek = applications.filter(app => {
    const appliedDate = new Date(app.applied_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return appliedDate >= weekAgo;
  });

  const hiredCount = applications.filter(app => app.status === 'hired').length;
  const interviewStage = applications.filter(app => app.status === 'interview').length;

  const metrics = [
    {
      title: 'Total Candidates',
      value: candidates.length.toString(),
      description: `${newApplicationsThisWeek.length} new this week`,
      icon: Users,
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'Active Jobs',
      value: activeJobs.length.toString(),
      description: `${jobs.filter(j => j.priority === 'high').length} high priority`,
      icon: Briefcase,
      trend: '+5%',
      trendUp: true
    },
    {
      title: 'Applications',
      value: applications.length.toString(),
      description: `${newApplicationsThisWeek.length} this week`,
      icon: TrendingUp,
      trend: '+8%',
      trendUp: true
    },
    {
      title: 'Interviews Scheduled',
      value: interviewStage.toString(),
      description: 'Active in pipeline',
      icon: Calendar,
      trend: '+15%',
      trendUp: true
    },
    {
      title: 'Hired',
      value: hiredCount.toString(),
      description: 'This month',
      icon: Target,
      trend: '+3%',
      trendUp: true
    },
    {
      title: 'Avg. Time to Hire',
      value: '18 days',
      description: '2 days faster',
      icon: Clock,
      trend: '-10%',
      trendUp: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {metric.description}
                </p>
                <Badge 
                  variant={metric.trendUp ? "default" : "secondary"}
                  className="text-xs"
                >
                  {metric.trend}
                </Badge>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ATSMetrics;
