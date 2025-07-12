
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { DataSourceConfig, FilterConfig } from '@/types/common';

interface SupabaseTableConfigProps {
  config: DataSourceConfig;
  setConfig: (config: DataSourceConfig | ((prev: DataSourceConfig) => DataSourceConfig)) => void;
  newFilter: FilterConfig;
  setNewFilter: (filter: FilterConfig | ((prev: FilterConfig) => FilterConfig)) => void;
  addFilter: () => void;
  removeFilter: (index: number) => void;
}

const SupabaseTableConfig: React.FC<SupabaseTableConfigProps> = ({
  config,
  setConfig,
  newFilter,
  setNewFilter,
  addFilter,
  removeFilter
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="table">Table Name</Label>
          <Select 
            value={config.query_config.table} 
            onValueChange={(value) => setConfig(prev => ({
              ...prev,
              query_config: { ...prev.query_config, table: value }
            }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select table" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="companies">Companies</SelectItem>
              <SelectItem value="people">People</SelectItem>
              <SelectItem value="talents">Talents</SelectItem>
              <SelectItem value="tenants">Tenants</SelectItem>
              <SelectItem value="profiles">Profiles</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="operation">Operation</Label>
          <Select 
            value={config.query_config.operation} 
            onValueChange={(value) => setConfig(prev => ({
              ...prev,
              query_config: { ...prev.query_config, operation: value }
            }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select operation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="select">Select</SelectItem>
              <SelectItem value="count">Count</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="columns">Columns (comma-separated, or * for all)</Label>
        <Input
          id="columns"
          value={config.query_config.columns}
          onChange={(e) => setConfig(prev => ({
            ...prev,
            query_config: { ...prev.query_config, columns: e.target.value }
          }))}
          placeholder="id, name, created_at"
        />
      </div>

      <div>
        <Label>Filters</Label>
        <div className="space-y-2">
          {config.query_config.filters.map((filter: FilterConfig, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                {filter.column} {filter.operator} {filter.value}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeFilter(index)}
                />
              </Badge>
            </div>
          ))}
          
          <div className="flex gap-2">
            <Input
              placeholder="Column"
              value={newFilter.column}
              onChange={(e) => setNewFilter(prev => ({ ...prev, column: e.target.value }))}
            />
            <Select 
              value={newFilter.operator} 
              onValueChange={(value) => setNewFilter(prev => ({ ...prev, operator: value }))}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equals">Equals</SelectItem>
                <SelectItem value="contains">Contains</SelectItem>
                <SelectItem value="greater_than">Greater than</SelectItem>
                <SelectItem value="less_than">Less than</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Value"
              value={newFilter.value}
              onChange={(e) => setNewFilter(prev => ({ ...prev, value: e.target.value }))}
            />
            <Button onClick={addFilter} size="sm">Add</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseTableConfig;
