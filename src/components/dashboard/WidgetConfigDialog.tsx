
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useWidgetDataSources } from '@/hooks/dashboard/useWidgetData';
import { DashboardWidget } from '@/hooks/dashboard/useDashboardConfig';

interface WidgetConfigDialogProps {
  isOpen: boolean;
  onClose: () => void;
  widget: DashboardWidget | null;
  initialConfig?: any;
  onSave: (config: any) => void;
}

const WidgetConfigDialog: React.FC<WidgetConfigDialogProps> = ({
  isOpen,
  onClose,
  widget,
  initialConfig,
  onSave,
}) => {
  const [config, setConfig] = useState<any>({});
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

  const updateConfig = (key: string, value: any) => {
    setConfig((prev: any) => ({ ...prev, [key]: value }));
  };

  if (!widget) return null;

  const renderWidgetSpecificConfig = () => {
    switch (widget.widget_type) {
      case 'metric_card':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="metric_type">Metric Type</Label>
              <Select value={config.metric_type || 'count'} onValueChange={(value) => updateConfig('metric_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select metric type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="count">Count</SelectItem>
                  <SelectItem value="sum">Sum</SelectItem>
                  <SelectItem value="average">Average</SelectItem>
                  <SelectItem value="percentage">Percentage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="format">Format</Label>
              <Select value={config.format || 'number'} onValueChange={(value) => updateConfig('format', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="currency">Currency</SelectItem>
                  <SelectItem value="percentage">Percentage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="trend_comparison"
                checked={config.trend_comparison || false}
                onCheckedChange={(checked) => updateConfig('trend_comparison', checked)}
              />
              <Label htmlFor="trend_comparison">Show trend comparison</Label>
            </div>
          </div>
        );

      case 'line_chart':
      case 'bar_chart':
      case 'pie_chart':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="x_axis">X-Axis Column</Label>
              <Input
                id="x_axis"
                value={config.x_axis || ''}
                onChange={(e) => updateConfig('x_axis', e.target.value)}
                placeholder="e.g., created_at, name"
              />
            </div>
            
            <div>
              <Label htmlFor="y_axis">Y-Axis Column</Label>
              <Input
                id="y_axis"
                value={config.y_axis || ''}
                onChange={(e) => updateConfig('y_axis', e.target.value)}
                placeholder="e.g., value, count"
              />
            </div>

            {widget.widget_type === 'pie_chart' && (
              <div>
                <Label htmlFor="data_column">Data Column</Label>
                <Input
                  id="data_column"
                  value={config.data_column || ''}
                  onChange={(e) => updateConfig('data_column', e.target.value)}
                  placeholder="e.g., value"
                />
              </div>
            )}
          </div>
        );

      case 'data_table':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="columns">Columns (comma-separated)</Label>
              <Input
                id="columns"
                value={config.columns?.join(',') || ''}
                onChange={(e) => updateConfig('columns', e.target.value.split(',').map((col: string) => col.trim()).filter(Boolean))}
                placeholder="e.g., name, email, created_at"
              />
            </div>
            
            <div>
              <Label htmlFor="page_size">Page Size</Label>
              <Input
                id="page_size"
                type="number"
                value={config.page_size || 10}
                onChange={(e) => updateConfig('page_size', parseInt(e.target.value))}
                min="1"
                max="100"
              />
            </div>
          </div>
        );

      case 'revenue_metric':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="metric_type">Revenue Metric Type</Label>
              <Select value={config.metric_type || 'mrr'} onValueChange={(value) => updateConfig('metric_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select metric type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mrr">Monthly Recurring Revenue</SelectItem>
                  <SelectItem value="arr">Annual Recurring Revenue</SelectItem>
                  <SelectItem value="churn_rate">Churn Rate</SelectItem>
                  <SelectItem value="ltv">Lifetime Value</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select value={config.currency || 'USD'} onValueChange={(value) => updateConfig('currency', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="JPY">JPY</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

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
          {/* Basic Configuration */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Widget Title</Label>
              <Input
                id="title"
                value={config.title || ''}
                onChange={(e) => updateConfig('title', e.target.value)}
                placeholder={widget.name}
              />
            </div>

            <div>
              <Label htmlFor="data_source">Data Source</Label>
              <Select value={config.data_source_id || ''} onValueChange={(value) => updateConfig('data_source_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select data source" />
                </SelectTrigger>
                <SelectContent>
                  {dataSources?.map((source) => (
                    <SelectItem key={source.id} value={source.id}>
                      {source.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Widget-Specific Configuration */}
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
