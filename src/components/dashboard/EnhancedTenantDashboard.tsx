
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PersonalizedRecommendations } from '@/components/ai/PersonalizedRecommendations';
import { BehavioralTrackingWrapper } from '@/components/ai/BehavioralTrackingWrapper';
import { useNavigationTracking } from '@/hooks/ai/useNavigationTracking';
import { useTenantContext } from '@/contexts/TenantContext';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Building2, Briefcase } from 'lucide-react';

interface DashboardMetric {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface EnhancedTenantDashboardProps {
  userId?: string;
  metrics?: DashboardMetric[];
}

export const EnhancedTenantDashboard: React.FC<EnhancedTenantDashboardProps> = ({
  userId = 'demo-user',
  metrics = []
}) => {
  const { selectedTenantId, selectedTenantName } = useTenantContext();
  const { trackFeatureUsage } = useNavigationTracking(userId);

  const defaultMetrics: DashboardMetric[] = [
    {
      title: 'Total People',
      value: 0,
      change: '+12% from last month',
      icon: Users
    },
    {
      title: 'Active Companies',
      value: 0,
      change: '+8% from last month',
      icon: Building2
    },
    {
      title: 'Open Positions',
      value: 0,
      change: '+15% from last month',
      icon: Briefcase
    },
    {
      title: 'Efficiency Score',
      value: '87%',
      change: '+5% from last month',
      icon: TrendingUp
    }
  ];

  const displayMetrics = metrics.length > 0 ? metrics : defaultMetrics;

  const handleMetricClick = (metricTitle: string) => {
    trackFeatureUsage('metric_view', { metric: metricTitle });
  };

  return (
    <BehavioralTrackingWrapper
      module="dashboard"
      action="view"
      metadata={{ tenantId: selectedTenantId, tenantName: selectedTenantName }}
      userId={userId}
    >
      <div className="space-y-6">
        {/* Tenant Context Header */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">
                    {selectedTenantName || 'Select a tenant'}
                  </p>
                  <p className="text-sm text-blue-600">
                    Enhanced with AI-powered insights
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                AI Enhanced
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayMetrics.map((metric, index) => (
            <Card 
              key={metric.title} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleMetricClick(metric.title)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <metric.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                {metric.change && (
                  <p className="text-xs text-muted-foreground mt-1">{metric.change}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Personalized Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PersonalizedRecommendations
              userId={userId}
              maxRecommendations={4}
              showNavigationRecommendations={true}
            />
          </div>
          
          {/* Quick Actions */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest actions and system events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    No recent activity to display
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </BehavioralTrackingWrapper>
  );
};
