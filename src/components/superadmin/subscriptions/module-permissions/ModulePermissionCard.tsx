
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import ModulePermissionLimits from './ModulePermissionLimits';

interface ModuleInfo {
  name: string;
  label: string;
  description: string;
  defaultLimits: Record<string, any>;
}

interface ModulePermissionCardProps {
  module: ModuleInfo;
  isEnabled: boolean;
  limits: Record<string, any>;
  onToggleEnabled: (checked: boolean) => void;
  onUpdateLimit: (limitKey: string, value: unknown) => void;
}

const ModulePermissionCard: React.FC<ModulePermissionCardProps> = ({
  module,
  isEnabled,
  limits,
  onToggleEnabled,
  onUpdateLimit
}) => {
  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">{module.label}</h4>
          <p className="text-sm text-muted-foreground">{module.description}</p>
        </div>
        <Switch
          checked={isEnabled}
          onCheckedChange={onToggleEnabled}
        />
      </div>

      {isEnabled && Object.keys(module.defaultLimits).length > 0 && (
        <ModulePermissionLimits
          defaultLimits={module.defaultLimits}
          currentLimits={limits}
          onUpdateLimit={onUpdateLimit}
        />
      )}
    </div>
  );
};

export default ModulePermissionCard;
