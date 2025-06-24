
import React from 'react';
import ModuleCategoryItem from './ModuleCategoryItem';

interface ModuleNavigationContentProps {
  groupedModules: Record<string, any[]>;
  expandedCategories: Set<string>;
  expandedModules: Set<string>;
  onToggleCategory: (categoryKey: string) => void;
  onToggleModule: (moduleId: string) => void;
  onModuleClick: (module: any) => void;
  onSubComponentClick: (path: string) => void;
}

const ModuleNavigationContent: React.FC<ModuleNavigationContentProps> = ({
  groupedModules,
  expandedCategories,
  expandedModules,
  onToggleCategory,
  onToggleModule,
  onModuleClick,
  onSubComponentClick,
}) => {
  return (
    <div className="ml-2 mt-1 space-y-1">
      {Object.entries(groupedModules).map(([categoryKey, categoryModules]) => (
        <ModuleCategoryItem
          key={categoryKey}
          categoryKey={categoryKey}
          categoryModules={categoryModules}
          isCategoryExpanded={expandedCategories.has(categoryKey)}
          expandedModules={expandedModules}
          onToggleCategory={onToggleCategory}
          onToggleModule={onToggleModule}
          onModuleClick={onModuleClick}
          onSubComponentClick={onSubComponentClick}
        />
      ))}
    </div>
  );
};

export default ModuleNavigationContent;
