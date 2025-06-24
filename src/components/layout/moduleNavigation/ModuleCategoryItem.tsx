
import React from 'react';
import { ChevronDown, ChevronRight, Blocks } from 'lucide-react';
import { CATEGORY_CONFIG } from './constants';
import ModuleItem from './ModuleItem';

interface ModuleCategoryItemProps {
  categoryKey: string;
  categoryModules: any[];
  isCategoryExpanded: boolean;
  expandedModules: Set<string>;
  onToggleCategory: (categoryKey: string) => void;
  onToggleModule: (moduleId: string) => void;
  onModuleClick: (module: any) => void;
  onSubComponentClick: (path: string) => void;
}

const ModuleCategoryItem: React.FC<ModuleCategoryItemProps> = ({
  categoryKey,
  categoryModules,
  isCategoryExpanded,
  expandedModules,
  onToggleCategory,
  onToggleModule,
  onModuleClick,
  onSubComponentClick,
}) => {
  const categoryConfig = CATEGORY_CONFIG[categoryKey];
  const CategoryIcon = categoryConfig?.icon || Blocks;

  return (
    <div className="space-y-1">
      {/* Category Header */}
      <button
        onClick={() => onToggleCategory(categoryKey)}
        className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md"
      >
        <div className="flex items-center gap-2">
          <CategoryIcon className="h-4 w-4 text-gray-500" />
          <span className="font-medium">{categoryConfig?.name || categoryKey}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            {categoryModules.length}
          </span>
          {isCategoryExpanded ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </div>
      </button>

      {/* Category Modules */}
      {isCategoryExpanded && (
        <div className="ml-4 space-y-1">
          {categoryModules.map((module) => (
            <ModuleItem
              key={module.id}
              module={module}
              isExpanded={expandedModules.has(module.id)}
              onToggle={() => onToggleModule(module.id)}
              onModuleClick={onModuleClick}
              onSubComponentClick={onSubComponentClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ModuleCategoryItem;
