
import React, { useState } from 'react';
import { useDashboardWidgets, useCreateDashboardConfig } from '@/hooks/dashboard/useDashboardConfig';
import { useWidgetDataSources } from '@/hooks/dashboard/useWidgetData';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import WidgetConfigDialog from './WidgetConfigDialog';
import DataSourceConfig from './DataSourceConfig';
import DashboardBuilderHeader from './builder/DashboardBuilderHeader';
import WidgetPalette from './builder/WidgetPalette';
import DashboardPreview from './builder/DashboardPreview';
import { DashboardWidget, AvailableWidget, DataSource, WidgetConfig } from '@/types/common';

const DashboardBuilder: React.FC = () => {
  const { user } = useAuth();
  const [dashboardName, setDashboardName] = useState('My Dashboard');
  const [selectedWidgets, setSelectedWidgets] = useState<DashboardWidget[]>([]);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [dataSourceDialogOpen, setDataSourceDialogOpen] = useState(false);
  const [editingWidget, setEditingWidget] = useState<{ widget: DashboardWidget; index: number } | null>(null);
  
  const { data: availableWidgets, isLoading: widgetsLoading } = useDashboardWidgets();
  const { data: dataSources, isLoading: dataSourcesLoading, refetch: refetchDataSources } = useWidgetDataSources();
  const { mutate: createDashboard, isPending: isSaving } = useCreateDashboardConfig();

  const addWidget = (widget: AvailableWidget) => {
    const newWidget: DashboardWidget = {
      id: `widget-${Date.now()}`,
      widget_type: widget.widget_type,
      data_source_id: dataSources?.[0]?.id || '',
      config: { 
        title: widget.name,
        ...widget.default_config 
      }
    };
    setSelectedWidgets([...selectedWidgets, newWidget]);
  };

  const removeWidget = (widgetId: string) => {
    setSelectedWidgets(selectedWidgets.filter(w => w.id !== widgetId));
  };

  const openWidgetConfig = (widget: DashboardWidget, index: number) => {
    setEditingWidget({ widget, index });
    setConfigDialogOpen(true);
  };

  const saveWidgetConfig = (config: WidgetConfig) => {
    if (editingWidget) {
      const updatedWidgets = [...selectedWidgets];
      updatedWidgets[editingWidget.index] = {
        ...updatedWidgets[editingWidget.index],
        config,
      };
      setSelectedWidgets(updatedWidgets);
      setEditingWidget(null);
    }
  };

  const saveDataSource = (dataSourceConfig: Record<string, unknown>) => {
    console.log('Saving data source:', dataSourceConfig);
    toast.success('Data source configuration saved!');
    refetchDataSources();
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

    if (selectedWidgets.length === 0) {
      toast.error('Please add at least one widget to the dashboard');
      return;
    }

    const dashboardConfig = {
      user_id: user.id,
      dashboard_name: dashboardName.trim(),
      layout_config: {
        columns: 4,
        row_height: 150,
        margin: [16, 16] as [number, number]
      },
      widget_configs: selectedWidgets,
      filters: {},
      is_default: false
    };

    createDashboard(dashboardConfig, {
      onSuccess: () => {
        toast.success('Dashboard saved successfully!');
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
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
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
  }, {} as Record<string, AvailableWidget[]>) || {};

  return (
    <div className="space-y-6">
      <DashboardBuilderHeader
        dashboardName={dashboardName}
        setDashboardName={setDashboardName}
        setDataSourceDialogOpen={setDataSourceDialogOpen}
        saveDashboard={saveDashboard}
        isSaving={isSaving}
        user={user}
        selectedWidgets={selectedWidgets}
        dataSources={dataSources || []}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <WidgetPalette
          widgetsByCategory={widgetsByCategory}
          addWidget={addWidget}
        />

        <DashboardPreview
          selectedWidgets={selectedWidgets}
          availableWidgets={availableWidgets || []}
          dataSources={dataSources || []}
          openWidgetConfig={openWidgetConfig}
          removeWidget={removeWidget}
        />
      </div>

      {selectedWidgets.length > 0 && (
        <Alert>
          <AlertDescription>
            Once saved, your dashboard will appear in the "Custom Dashboards" tab and can be set as your default dashboard.
          </AlertDescription>
        </Alert>
      )}

      <WidgetConfigDialog
        isOpen={configDialogOpen}
        onClose={() => {
          setConfigDialogOpen(false);
          setEditingWidget(null);
        }}
        widget={editingWidget ? availableWidgets?.find(w => w.widget_type === editingWidget.widget.widget_type) || null : null}
        initialConfig={editingWidget?.widget.config}
        onSave={saveWidgetConfig}
      />

      <DataSourceConfig
        isOpen={dataSourceDialogOpen}
        onClose={() => setDataSourceDialogOpen(false)}
        onSave={saveDataSource}
      />
    </div>
  );
};

export default DashboardBuilder;
