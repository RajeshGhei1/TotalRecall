
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataSourceConfig } from '@/types/common';

interface DataSourceFormProps {
  config: DataSourceConfig;
  setConfig: (config: DataSourceConfig | ((prev: DataSourceConfig) => DataSourceConfig)) => void;
}

const DataSourceForm: React.FC<DataSourceFormProps> = ({ config, setConfig }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="name">Data Source Name</Label>
        <Input
          id="name"
          value={config.name}
          onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
          placeholder="e.g., User Metrics"
        />
      </div>

      <div>
        <Label htmlFor="source_type">Source Type</Label>
        <Select 
          value={config.source_type} 
          onValueChange={(value) => setConfig(prev => ({ ...prev, source_type: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select source type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="supabase_table">Supabase Table</SelectItem>
            <SelectItem value="custom_query">Custom Query</SelectItem>
            <SelectItem value="calculated">Calculated Metric</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default DataSourceForm;
