
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ModulePermissionLimitsProps {
  defaultLimits: Record<string, any>;
  currentLimits: Record<string, any>;
  onUpdateLimit: (limitKey: string, value: unknown) => void;
}

const ModulePermissionLimits: React.FC<ModulePermissionLimitsProps> = ({
  defaultLimits,
  currentLimits,
  onUpdateLimit
}) => {
  return (
    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
      {Object.entries(defaultLimits).map(([limitKey, defaultValue]) => (
        <div key={limitKey} className="space-y-2">
          <Label className="text-xs capitalize">
            {limitKey.replace(/_/g, ' ')}
          </Label>
          <Input
            type="number"
            value={currentLimits[limitKey] || defaultValue}
            onChange={(e) => 
              onUpdateLimit(limitKey, parseInt(e.target.value) || 0)
            }
            className="h-8"
          />
        </div>
      ))}
    </div>
  );
};

export default ModulePermissionLimits;
