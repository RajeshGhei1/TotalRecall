import React from 'react';
import { Blocks, ChevronDown, ChevronRight } from 'lucide-react';
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
    expandedTypes,
    expandedModules,
    toggleType,
    toggleModule,
    handleModuleClick,
    handleSubComponentClick,
    getModuleStatus,
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

  // Calculate status counts for display
  const statusCounts = modules?.reduce((acc, module) => {
    const status = getModuleStatus(module);
    acc[status.status] = (acc[status.status] || 0) + 1;
    acc.total = (acc.total || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || { total: 0 };

  return (
    <div className="w-full">
      {/* Main Modules Header */}
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
      >
        <div className="flex items-center gap-2">
          <Blocks className="h-4 w-4 text-blue-600" />
          <span>Apps</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {statusCounts.total}
          </span>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </div>
      </button>

      {/* Status Legend (when expanded) */}
      {isExpanded && (
        <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100 mb-2">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Live ({statusCounts.production || 0})</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <span>Testing ({statusCounts.beta || 0})</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <span>Dev ({statusCounts.alpha || 0})</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span>Planning ({statusCounts.planning || 0})</span>
            </div>
            {statusCounts.inactive > 0 && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span>Inactive ({statusCounts.inactive})</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Categories and Modules */}
      {isExpanded && (
        <ModuleNavigationContent
          groupedModules={groupedModules}
          expandedTypes={expandedTypes}
          expandedModules={expandedModules}
          onToggleType={toggleType}
          onToggleModule={toggleModule}
          onModuleClick={handleModuleClick}
          onSubComponentClick={handleSubComponentClick}
          getModuleStatus={getModuleStatus}
        />
      )}
    </div>
  );
};

export default ModuleNavigationItem;
