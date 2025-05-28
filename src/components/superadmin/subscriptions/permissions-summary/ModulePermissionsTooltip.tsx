
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';

interface ModuleDetail {
  name: string;
  label: string;
  isEnabled: boolean;
  limits: Record<string, any>;
}

interface ModulePermissionsTooltipProps {
  moduleDetails: ModuleDetail[];
  children: React.ReactNode;
}

const ModulePermissionsTooltip: React.FC<ModulePermissionsTooltipProps> = ({
  moduleDetails,
  children
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent className="max-w-sm p-3">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Module Permissions</h4>
            <div className="space-y-1">
              {moduleDetails.map((module) => (
                <div key={module.name} className="flex items-center justify-between text-xs">
                  <span>{module.label}</span>
                  <Badge 
                    variant={module.isEnabled ? 'default' : 'outline'}
                    className="text-xs"
                  >
                    {module.isEnabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ModulePermissionsTooltip;
