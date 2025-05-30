
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Layout, Settings, Trash2 } from 'lucide-react';

interface DashboardPreviewProps {
  selectedWidgets: any[];
  availableWidgets: any[];
  dataSources: any[];
  openWidgetConfig: (widget: any, index: number) => void;
  removeWidget: (widgetId: string) => void;
}

const DashboardPreview: React.FC<DashboardPreviewProps> = ({
  selectedWidgets,
  availableWidgets,
  dataSources,
  openWidgetConfig,
  removeWidget
}) => {
  return (
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
            {selectedWidgets.map((widget, index) => {
              const widgetDef = availableWidgets?.find(w => w.widget_type === widget.widget_type);
              const dataSource = dataSources?.find(ds => ds.id === widget.data_source_id);
              
              return (
                <div
                  key={widget.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Badge variant="secondary">{widgetDef?.category}</Badge>
                    <div className="flex-1">
                      <div className="font-medium">{widget.config.title || widgetDef?.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {widgetDef?.widget_type} • {dataSource?.name || 'No data source'}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => openWidgetConfig(widget, index)}
                    >
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
  );
};

export default DashboardPreview;
