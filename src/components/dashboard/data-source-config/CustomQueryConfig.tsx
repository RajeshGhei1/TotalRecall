
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface CustomQueryConfigProps {
  config: any;
  setConfig: (config: any) => void;
}

const CustomQueryConfig: React.FC<CustomQueryConfigProps> = ({ config, setConfig }) => {
  return (
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
  );
};

export default CustomQueryConfig;
