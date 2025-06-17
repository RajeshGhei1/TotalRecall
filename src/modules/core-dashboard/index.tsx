
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, TrendingUp, Activity } from 'lucide-react';

interface CoreDashboardProps {
  title?: string;
  showMetrics?: boolean;
  variant?: 'default' | 'compact' | 'expanded';
}

const CoreDashboard: React.FC<CoreDashboardProps> = ({
  title = 'Core Dashboard',
  showMetrics = true,
  variant = 'default'
}) => {
  const metrics = [
    { label: 'Total Users', value: '2,847', change: '+12%', icon: Users },
    { label: 'Active Sessions', value: '456', change: '+8%', icon: Activity },
    { label: 'Growth Rate', value: '23.5%', change: '+5%', icon: TrendingUp },
    { label: 'Performance', value: '98.2%', change: '+2%', icon: BarChart3 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>

      {showMetrics && (
        <div className={`grid gap-4 ${variant === 'compact' ? 'grid-cols-2' : 'grid-cols-4'}`}>
          {metrics.map((metric, index) => {
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
                    <span className="text-green-600">{metric.change}</span> from last month
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">All Systems Operational</div>
            <p className="text-sm text-muted-foreground">Last updated: 2 minutes ago</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>User logins</span>
                <span className="font-medium">234 today</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>New registrations</span>
                <span className="font-medium">12 today</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Active modules</span>
                <span className="font-medium">15 running</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button className="w-full text-left text-sm hover:bg-muted p-2 rounded">
                View System Logs
              </button>
              <button className="w-full text-left text-sm hover:bg-muted p-2 rounded">
                Manage Users
              </button>
              <button className="w-full text-left text-sm hover:bg-muted p-2 rounded">
                Configuration
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Module metadata for registration
(CoreDashboard as any).moduleMetadata = {
  id: 'core-dashboard',
  name: 'Core Dashboard',
  category: 'core',
  version: '1.0.0',
  description: 'Primary dashboard with system overview and metrics',
  author: 'System',
  requiredPermissions: ['read'],
  dependencies: [],
  props: {
    title: { type: 'string', default: 'Core Dashboard' },
    showMetrics: { type: 'boolean', default: true },
    variant: { type: 'string', options: ['default', 'compact', 'expanded'], default: 'default' }
  }
};

export default CoreDashboard;
