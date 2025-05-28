
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ModulePermissionBadgeProps {
  enabledModules: number;
  totalModules: number;
  enabledPercentage: number;
}

const ModulePermissionBadge: React.FC<ModulePermissionBadgeProps> = ({
  enabledModules,
  totalModules,
  enabledPercentage
}) => {
  const getVariant = () => {
    if (enabledPercentage >= 75) return 'default';
    if (enabledPercentage >= 50) return 'secondary';
    return 'outline';
  };

  const getColor = () => {
    if (enabledPercentage >= 75) return 'text-green-700 bg-green-100';
    if (enabledPercentage >= 50) return 'text-yellow-700 bg-yellow-100';
    return 'text-red-700 bg-red-100';
  };

  return (
    <Badge variant={getVariant()} className={getColor()}>
      {enabledModules}/{totalModules} modules
    </Badge>
  );
};

export default ModulePermissionBadge;
