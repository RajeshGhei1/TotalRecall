
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useWidgetDataSources } from '@/hooks/dashboard/useWidgetData';
import { DashboardWidget } from '@/hooks/dashboard/useDashboardConfig';
import BasicConfig from './widget-config/BasicConfig';
import MetricCardConfig from './widget-config/MetricCardConfig';
import ChartConfig from './widget-config/ChartConfig';
import TableConfig from './widget-config/TableConfig';
import RevenueConfig from './widget-config/RevenueConfig';
import { WidgetConfig } from '@/types/common';

interface WidgetConfigDialogProps {
  isOpen: boolean;
  onClose: () => void;
  widget: DashboardWidget | null;
  initialConfig?: WidgetConfig;
  onSave: (config: WidgetConfig) => void;
}

const WidgetConfigDialog: React.FC<WidgetConfigDialogProps> = ({
  isOpen,
  onClose,
  widget,
  initialConfig,
  onSave,
}) => {
  const [config, setConfig] = useState<WidgetConfig>({ title: '' });
  const { data: dataSources } = useWidgetDataSources();

  useEffect(() => {
    if (widget && isOpen) {
      setConfig({
        ...widget.default_config,
        ...initialConfig,
        data_source_id: initialConfig?.data_source_id || dataSources?.[0]?.id || '',
      });
    }
  }, [widget, initialConfig, isOpen, dataSources]);

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  const updateConfig = (key: string, value: unknown) => {
    setConfig((prev: WidgetConfig) => ({ ...prev, [key]: value }));
  };

  if (!widget) return null;

  const renderWidgetSpecificConfig = () => {
    switch (widget.widget_type) {
      case 'metric_card':
        return <MetricCardConfig config={config} updateConfig={updateConfig} />;

      case 'line_chart':
      case 'bar_chart':
      case 'pie_chart':
        return <ChartConfig config={config} updateConfig={updateConfig} widgetType={widget.widget_type} />;

      case 'data_table':
        return <TableConfig config={config} updateConfig={updateConfig} />;

      case 'revenue_metric':
        return <RevenueConfig config={config} updateConfig={updateConfig} />;

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configure {widget.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <BasicConfig 
            config={config} 
            updateConfig={updateConfig} 
            widget={widget} 
            dataSources={dataSources || []} 
          />
          {renderWidgetSpecificConfig()}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WidgetConfigDialog;
