
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { WidgetConfig } from '@/types/common';

interface TableConfigProps {
  config: WidgetConfig;
  updateConfig: (key: string, value: unknown) => void;
}

const TableConfig: React.FC<TableConfigProps> = ({ config, updateConfig }) => {
  const columnsArray = Array.isArray(config.columns) ? config.columns : [];
  const pageSize = typeof config.page_size === 'number' ? config.page_size : 10;

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="columns">Columns (comma-separated)</Label>
        <Input
          id="columns"
          value={columnsArray.join(',') || ''}
          onChange={(e) => updateConfig('columns', e.target.value.split(',').map((col: string) => col.trim()).filter(Boolean))}
          placeholder="e.g., name, email, created_at"
        />
      </div>
      
      <div>
        <Label htmlFor="page_size">Page Size</Label>
        <Input
          id="page_size"
          type="number"
          value={pageSize}
          onChange={(e) => updateConfig('page_size', parseInt(e.target.value))}
          min="1"
          max="100"
        />
      </div>
    </div>
  );
};

export default TableConfig;
