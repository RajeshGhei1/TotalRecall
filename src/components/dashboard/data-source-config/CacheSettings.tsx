
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { DataSourceConfig } from '@/types/common';

interface CacheSettingsProps {
  config: DataSourceConfig;
  setConfig: (config: DataSourceConfig | ((prev: DataSourceConfig) => DataSourceConfig)) => void;
}

const CacheSettings: React.FC<CacheSettingsProps> = ({ config, setConfig }) => {
  return (
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
  );
};

export default CacheSettings;
