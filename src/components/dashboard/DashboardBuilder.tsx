
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Settings, Save, Layout } from 'lucide-react';
import { useDashboardWidgets, useCreateDashboardConfig } from '@/hooks/dashboard/useDashboardConfig';
import { useWidgetDataSources } from '@/hooks/dashboard/useWidgetData';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

const DashboardBuilder: React.FC = () => {
  const { user } = useAuth();
  const [dashboardName, setDashboardName] = useState('My Dashboard');
  const [selectedWidgets, setSelectedWidgets] = useState<any[]>([]);
  const { data: availableWidgets, isLoading: widgetsLoading } = useDashboardWidgets();
  const { data: dataSources, isLoading: dataSourcesLoading } = useWidgetDataSources();
  const { mutate: createDashboard, isPending: isSaving } = useCreateDashboardConfig();

  const addWidget = (widget: any) => {
    const newWidget = {
      id: `widget-${Date.now()}`,
      widget_type: widget.widget_type,
      data_source_id: dataSources?.[0]?.id || '',
      config: { ...widget.default_config }
    };
    setSelectedWidgets([...selectedWidgets, newWidget]);
  };

  const removeWidget = (widgetId: string) => {
    setSelectedWidgets(selectedWidgets.filter(w => w.id !== widgetId));
  };

  const saveDashboard = () => {
    if (!user?.id) {
      toast.error('You must be logged in to save dashboards');
      return;
    }

    if (!dashboardName.trim()) {
      toast.error('Please enter a dashboard name');
      return;
    }

    const dashboardConfig = {
      user_id: user.id,
      dashboard_name: dashboardName.trim(),
      layout_config: {
        columns: 4,
        row_height: 150,
        margin: [16, 16]
      },
      widget_configs: selectedWidgets,
      filters: {},
      is_default: false
    };

    createDashboard(dashboardConfig, {
      onSuccess: () => {
        toast.success('Dashboard saved successfully!');
        // Reset form
        setDashboardName('My Dashboard');
        setSelectedWidgets([]);
      },
      onError: (error) => {
        console.error('Failed to save dashboard:', error);
        toast.error('Failed to save dashboard. Please try again.');
      }
    });
  };

  if (widgetsLoading || dataSourcesLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const widgetsByCategory = availableWidgets?.reduce((acc, widget) => {
    if (!acc[widget.category]) {
      acc[widget.category] = [];
    }
    acc[widget.category].push(widget);
    return acc;
  }, {} as Record<string, any[]>) || {};

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layout className="h-5 w-5" />
            Dashboard Builder
          </CardTitle>
          <CardDescription>
            Create and customize your analytics dashboard with drag-and-drop widgets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="dashboard-name">Dashboard Name</Label>
              <Input
                id="dashboard-name"
                value={dashboardName}
                onChange={(e) => setDashboardName(e.target.value)}
                placeholder="Enter dashboard name"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={saveDashboard} 
                className="w-full"
                disabled={isSaving || !dashboardName.trim() || !user?.id}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Dashboard'}
              </Button>
            </div>
          </div>
          
          {!user?.id && (
            <Alert>
              <AlertDescription>
                You must be logged in to save dashboards.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Widget Palette */}
        <Card>
          <CardHeader>
            <CardTitle>Available Widgets</CardTitle>
            <CardDescription>
              Click on widgets to add them to your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(widgetsByCategory).map(([category, widgets]) => (
              <div key={category} className="space-y-2">
                <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
                  {category}
                </h4>
                <div className="grid gap-2">
                  {widgets.map((widget) => (
                    <div
                      key={widget.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => addWidget(widget)}
                    >
                      <div>
                        <div className="font-medium">{widget.name}</div>
                        {widget.description && (
                          <div className="text-sm text-muted-foreground">
                            {widget.description}
                          </div>
                        )}
                      </div>
                      <Plus className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Dashboard Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Dashboard Preview</CardTitle>
            <CardDescription>
              Your dashboard layout with {selectedWidgets.length} widgets
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedWidgets.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Layout className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No widgets added yet</p>
                <p className="text-sm">Click on widgets from the palette to add them</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedWidgets.map((widget) => {
                  const widgetDef = availableWidgets?.find(w => w.widget_type === widget.widget_type);
                  return (
                    <div
                      key={widget.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">{widgetDef?.category}</Badge>
                        <div>
                          <div className="font-medium">{widget.config.title || widgetDef?.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {widgetDef?.widget_type}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeWidget(widget.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedWidgets.length > 0 && (
        <Alert>
          <AlertDescription>
            Once saved, your dashboard will appear in the "Dashboard Overview" tab and can be set as your default dashboard.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default DashboardBuilder;
