
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BasicConfigProps {
  config: any;
  updateConfig: (key: string, value: any) => void;
  widget: any;
  dataSources: any[];
}

const BasicConfig: React.FC<BasicConfigProps> = ({ config, updateConfig, widget, dataSources }) => {
  return (
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
  );
};

export default BasicConfig;
