
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardConfig, useUserDashboardConfigs, useDashboardWidgets } from '@/hooks/dashboard/useDashboardConfig';
import { useWidgetDataSources } from '@/hooks/dashboard/useWidgetData';
import DashboardWidget from './DashboardWidget';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Settings } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import DashboardBuilder from './DashboardBuilder';

const DynamicDashboard: React.FC = () => {
  const { user } = useAuth();
  const [isCustomizing, setIsCustomizing] = useState(false);
  const { data: userConfigs, isLoading: configsLoading } = useUserDashboardConfigs(user?.id);
  const { data: widgets, isLoading: widgetsLoading } = useDashboardWidgets();
  const { data: dataSources, isLoading: dataSourcesLoading } = useWidgetDataSources();

  // Get the default dashboard or first available
  const defaultConfig = userConfigs?.find(config => config.is_default) || userConfigs?.[0];

  if (configsLoading || widgetsLoading || dataSourcesLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Show dashboard builder when customizing
  if (isCustomizing) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Customize Dashboard</h2>
            <p className="text-muted-foreground">
              Add and configure widgets for your dashboard
            </p>
          </div>
          <Button variant="outline" onClick={() => setIsCustomizing(false)}>
            Back to Dashboard
          </Button>
        </div>
        <DashboardBuilder />
      </div>
    );
  }

  if (!defaultConfig) {
    return (
      <div className="text-center py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>No Dashboard Configuration</CardTitle>
            <CardDescription>
              You don't have any dashboard configurations yet. Create your first dashboard to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => setIsCustomizing(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Create sample widgets if no widget configs exist
  const widgetConfigs = defaultConfig.widget_configs.length > 0 
    ? defaultConfig.widget_configs 
    : createDefaultWidgets();

  function createDefaultWidgets() {
    const defaultWidgets = [
      {
        id: 'users-count',
        widget_type: 'metric_card',
        data_source_id: dataSources?.find(ds => ds.name === 'Users Count')?.id,
        config: { title: 'Total Users', metric_type: 'count', trend_comparison: true }
      },
      {
        id: 'companies-count',
        widget_type: 'metric_card',
        data_source_id: dataSources?.find(ds => ds.name === 'Companies Count')?.id,
        config: { title: 'Total Companies', metric_type: 'count', trend_comparison: true }
      },
      {
        id: 'talents-count',
        widget_type: 'metric_card',
        data_source_id: dataSources?.find(ds => ds.name === 'Talents Count')?.id,
        config: { title: 'Total Talents', metric_type: 'count', trend_comparison: true }
      },
      {
        id: 'tenants-count',
        widget_type: 'metric_card',
        data_source_id: dataSources?.find(ds => ds.name === 'Tenants Count')?.id,
        config: { title: 'Active Tenants', metric_type: 'count', trend_comparison: true }
      },
    ];
    
    return defaultWidgets.filter(w => w.data_source_id);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{defaultConfig.dashboard_name}</h2>
          <p className="text-muted-foreground">
            Real-time business intelligence and analytics overview
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsCustomizing(true)}>
          <Settings className="mr-2 h-4 w-4" />
          Customize
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {widgetConfigs.map((widgetConfig: any) => {
          const widget = widgets?.find(w => w.widget_type === widgetConfig.widget_type);
          const dataSource = dataSources?.find(ds => ds.id === widgetConfig.data_source_id);
          
          if (!widget || !dataSource) {
            return null;
          }

          return (
            <DashboardWidget
              key={widgetConfig.id}
              widget={widget}
              dataSource={dataSource}
              config={widgetConfig.config}
            />
          );
        })}
      </div>

      {widgetConfigs.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-medium mb-2">No widgets configured</h3>
            <p className="text-muted-foreground mb-4 text-center">
              Add widgets to your dashboard to start viewing your analytics
            </p>
            <Button onClick={() => setIsCustomizing(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Widget
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DynamicDashboard;
