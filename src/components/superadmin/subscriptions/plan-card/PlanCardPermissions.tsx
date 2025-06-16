
import React from 'react';
import { Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  ModulePermissionBadge, 
  LimitationsBadge, 
  ModulePermissionsTooltip,
  CollapsiblePermissionsSection 
} from '../permissions-summary';
import { ModulePermissionSummary } from '@/hooks/subscriptions/useModulePermissionsSummary';

interface PlanCardPermissionsProps {
  permissionsSummary: ModulePermissionSummary | undefined;
  isLoading: boolean;
}

const PlanCardPermissions: React.FC<PlanCardPermissionsProps> = ({ 
  permissionsSummary, 
  isLoading 
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!permissionsSummary) return null;

  const enabledModules = permissionsSummary.moduleDetails.filter(m => m.isEnabled);
  const topModules = enabledModules.slice(0, 3);

  return (
    <>
      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
        <h4 className="text-lg font-semibold text-gray-800">Module Access</h4>
        <ModulePermissionsTooltip moduleDetails={permissionsSummary.moduleDetails}>
          <div className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-help">
            <Info className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </div>
        </ModulePermissionsTooltip>
      </div>
      
      <div className="flex flex-wrap gap-3 mb-4">
        <ModulePermissionBadge
          enabledModules={permissionsSummary.enabledModules}
          totalModules={permissionsSummary.totalModules}
          enabledPercentage={permissionsSummary.enabledPercentage}
        />
        {permissionsSummary.keyLimitations.length > 0 && (
          <LimitationsBadge limitations={permissionsSummary.keyLimitations} />
        )}
      </div>

      {/* Show top enabled modules directly */}
      {enabledModules.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Enabled Modules:</p>
          <div className="flex flex-wrap gap-2">
            {topModules.map((module) => (
              <Badge 
                key={module.name} 
                variant="default" 
                className="text-xs bg-green-100 text-green-800 border-green-200"
              >
                {module.label}
              </Badge>
            ))}
            {enabledModules.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{enabledModules.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      )}

      <div className="max-w-full overflow-hidden">
        <CollapsiblePermissionsSection 
          moduleDetails={permissionsSummary.moduleDetails} 
          expandByDefault={true}
        />
      </div>
    </>
  );
};

export default PlanCardPermissions;
