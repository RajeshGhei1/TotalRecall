
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface TableConfigProps {
  config: any;
  updateConfig: (key: string, value: any) => void;
}

const TableConfig: React.FC<TableConfigProps> = ({ config, updateConfig }) => {
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
};

export default TableConfig;
