
import React, { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface DataSourceConfigProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dataSource: any) => void;
}

const DataSourceConfig: React.FC<DataSourceConfigProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [config, setConfig] = useState({
    name: '',
    source_type: 'supabase_table',
    query_config: {
      table: '',
      operation: 'select',
      columns: '*',
      filters: [],
      query: '', // Add query field for custom queries
    },
    refresh_interval: 300,
    cache_duration: 300,
  });

  const [newFilter, setNewFilter] = useState({
    column: '',
    operator: 'equals',
    value: '',
  });

  const handleSave = () => {
    onSave(config);
    onClose();
    // Reset form
    setConfig({
      name: '',
      source_type: 'supabase_table',
      query_config: {
        table: '',
        operation: 'select',
        columns: '*',
        filters: [],
        query: '',
      },
      refresh_interval: 300,
      cache_duration: 300,
    });
  };

  const addFilter = () => {
    if (newFilter.column && newFilter.value) {
      setConfig(prev => ({
        ...prev,
        query_config: {
          ...prev.query_config,
          filters: [...prev.query_config.filters, { ...newFilter }]
        }
      }));
      setNewFilter({ column: '', operator: 'equals', value: '' });
    }
  };

  const removeFilter = (index: number) => {
    setConfig(prev => ({
      ...prev,
      query_config: {
        ...prev.query_config,
        filters: prev.query_config.filters.filter((_, i) => i !== index)
      }
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Configure Data Source</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
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

          {config.source_type === 'supabase_table' && (
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
                  {config.query_config.filters.map((filter: any, index: number) => (
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
          )}

          {config.source_type === 'custom_query' && (
            <div>
              <Label htmlFor="custom_query">Custom SQL Query</Label>
              <Textarea
                id="custom_query"
                value={config.query_config.query || ''}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  query_config: { ...prev.query_config, query: e.target.value }
                }))}
                placeholder="SELECT COUNT(*) FROM users WHERE created_at > '2024-01-01'"
                rows={4}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="refresh_interval">Refresh Interval (seconds)</Label>
              <Input
                id="refresh_interval"
                type="number"
                value={config.refresh_interval}
                onChange={(e) => setConfig(prev => ({ ...prev, refresh_interval: parseInt(e.target.value) }))}
                min="60"
              />
            </div>

            <div>
              <Label htmlFor="cache_duration">Cache Duration (seconds)</Label>
              <Input
                id="cache_duration"
                type="number"
                value={config.cache_duration}
                onChange={(e) => setConfig(prev => ({ ...prev, cache_duration: parseInt(e.target.value) }))}
                min="60"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Data Source
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DataSourceConfig;
