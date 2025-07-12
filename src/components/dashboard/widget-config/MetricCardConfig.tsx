
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { WidgetConfig } from '@/types/common';

interface MetricCardConfigProps {
  config: WidgetConfig;
  updateConfig: (key: string, value: unknown) => void;
}

const MetricCardConfig: React.FC<MetricCardConfigProps> = ({ config, updateConfig }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="metric_type">Metric Type</Label>
        <Select value={String(config.metric_type || 'count')} onValueChange={(value) => updateConfig('metric_type', value)}>
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
        <Select value={String(config.format || 'number')} onValueChange={(value) => updateConfig('format', value)}>
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
          checked={Boolean(config.trend_comparison)}
          onCheckedChange={(checked) => updateConfig('trend_comparison', checked)}
        />
        <Label htmlFor="trend_comparison">Show trend comparison</Label>
      </div>
    </div>
  );
};

export default MetricCardConfig;
