
import React from 'react';
import { ChevronDown, ChevronRight, Blocks } from 'lucide-react';
import { useModuleNavigation } from './moduleNavigation/useModuleNavigation';
import ModuleNavigationContent from './moduleNavigation/ModuleNavigationContent';

interface ModuleNavigationItemProps {
  isExpanded: boolean;
  onToggle: () => void;
}

const ModuleNavigationItem: React.FC<ModuleNavigationItemProps> = ({
  isExpanded,
  onToggle,
}) => {
  const {
    modules,
    isLoading,
    groupedModules,
    expandedCategories,
    expandedModules,
    toggleCategory,
    toggleModule,
    handleModuleClick,
    handleSubComponentClick,
  } = useModuleNavigation();

  if (isLoading) {
    return (
      <div className="px-3 py-2">
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Main Modules Header */}
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
      >
        <div className="flex items-center gap-2">
          <Blocks className="h-4 w-4 text-blue-600" />
          <span>Modules</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {modules?.length || 0}
          </span>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </div>
      </button>

      {/* Categories and Modules */}
      {isExpanded && (
        <ModuleNavigationContent
          groupedModules={groupedModules}
          expandedCategories={expandedCategories}
          expandedModules={expandedModules}
          onToggleCategory={toggleCategory}
          onToggleModule={toggleModule}
          onModuleClick={handleModuleClick}
          onSubComponentClick={handleSubComponentClick}
        />
      )}
    </div>
  );
};

export default ModuleNavigationItem;
