
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WidgetConfig, AvailableWidget, DataSource } from '@/types/common';

interface BasicConfigProps {
  config: WidgetConfig;
  updateConfig: (key: string, value: unknown) => void;
  widget: AvailableWidget;
  dataSources: DataSource[];
}

const BasicConfig: React.FC<BasicConfigProps> = ({ config, updateConfig, widget, dataSources }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Widget Title</Label>
        <Input
          id="title"
          value={String(config.title || '')}
          onChange={(e) => updateConfig('title', e.target.value)}
          placeholder={widget.name}
        />
      </div>

      <div>
        <Label htmlFor="data_source">Data Source</Label>
        <Select value={String(config.data_source_id || '')} onValueChange={(value) => updateConfig('data_source_id', value)}>
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
  );
};

export default BasicConfig;
