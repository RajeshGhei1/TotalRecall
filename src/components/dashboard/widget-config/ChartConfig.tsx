
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ChartConfigProps {
  config: any;
  updateConfig: (key: string, value: any) => void;
  widgetType: string;
}

const ChartConfig: React.FC<ChartConfigProps> = ({ config, updateConfig, widgetType }) => {
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

      {widgetType === 'pie_chart' && (
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
};

export default ChartConfig;
