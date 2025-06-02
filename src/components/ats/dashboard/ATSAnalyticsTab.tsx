
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import TalentMetricsDashboard from '@/components/talent/TalentMetricsDashboard';
import TalentHiringTrends from '@/components/reporting/charts/TalentHiringTrends';
import JobPostingsOverview from '@/components/reporting/charts/JobPostingsOverview';

interface ATSAnalyticsTabProps {
  type: 'talent' | 'recruiting';
}

const ATSAnalyticsTab = ({ type }: ATSAnalyticsTabProps) => {
  if (type === 'talent') {
    return (
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
    );
  }

  return (
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
  );
};

export default ATSAnalyticsTab;
