import React from 'react';
import { SystemModule } from '@/hooks/useSystemModules';
import ModuleTypeItem from './ModuleTypeItem';

interface ModuleNavigationContentProps {
  groupedModules: Record<string, SystemModule[]>;
  expandedTypes: Set<string>;
  expandedModules: Set<string>;
  onToggleType: (typeKey: string) => void;
  onToggleModule: (moduleId: string) => void;
  onModuleClick: (module: SystemModule) => void;
  onSubComponentClick: (path: string) => void;
  getModuleStatus: (module: SystemModule) => {
    status: string;
    color: string;
    label: string;
    description: string;
  };
}

const ModuleNavigationContent: React.FC<ModuleNavigationContentProps> = ({
  groupedModules,
  expandedTypes,
  expandedModules,
  onToggleType,
  onToggleModule,
  onModuleClick,
  onSubComponentClick,
  getModuleStatus,
}) => {
  return (
    <div className="ml-2 mt-1 space-y-1">
      {Object.entries(groupedModules).map(([typeKey, typeModules]) => (
        <ModuleTypeItem
          key={typeKey}
          typeKey={typeKey}
          typeModules={typeModules}
          isTypeExpanded={expandedTypes.has(typeKey)}
          expandedModules={expandedModules}
          onToggleType={onToggleType}
          onToggleModule={onToggleModule}
          onModuleClick={onModuleClick}
          onSubComponentClick={onSubComponentClick}
          getModuleStatus={getModuleStatus}
        />
      ))}
    </div>
  );
};

export default ModuleNavigationContent;
