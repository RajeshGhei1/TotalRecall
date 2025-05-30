
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import DataSourceForm from './data-source-config/DataSourceForm';
import SupabaseTableConfig from './data-source-config/SupabaseTableConfig';
import CustomQueryConfig from './data-source-config/CustomQueryConfig';
import CacheSettings from './data-source-config/CacheSettings';

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
      query: '',
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
          <DataSourceForm config={config} setConfig={setConfig} />

          {config.source_type === 'supabase_table' && (
            <SupabaseTableConfig
              config={config}
              setConfig={setConfig}
              newFilter={newFilter}
              setNewFilter={setNewFilter}
              addFilter={addFilter}
              removeFilter={removeFilter}
            />
          )}

          {config.source_type === 'custom_query' && (
            <CustomQueryConfig config={config} setConfig={setConfig} />
          )}

          <CacheSettings config={config} setConfig={setConfig} />
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
