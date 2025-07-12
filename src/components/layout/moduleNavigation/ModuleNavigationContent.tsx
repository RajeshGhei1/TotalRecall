import React from 'react';
import ModuleTypeItem from './ModuleTypeItem';

interface ModuleNavigationContentProps {
  groupedModules: Record<string, any[]>;
  expandedTypes: Set<string>;
  expandedModules: Set<string>;
  onToggleType: (typeKey: string) => void;
  onToggleModule: (moduleId: string) => void;
  onModuleClick: (module: unknown) => void;
  onSubComponentClick: (path: string) => void;
}

const ModuleNavigationContent: React.FC<ModuleNavigationContentProps> = ({
  groupedModules,
  expandedTypes,
  expandedModules,
  onToggleType,
  onToggleModule,
  onModuleClick,
  onSubComponentClick,
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
        />
      ))}
    </div>
  );
};

export default ModuleNavigationContent;
