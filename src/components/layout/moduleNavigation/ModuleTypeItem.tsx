import React from 'react';
import { ChevronDown, ChevronRight, Blocks } from 'lucide-react';
import { TYPE_CONFIG } from './constants';
import ModuleItem from './ModuleItem';

interface ModuleTypeItemProps {
  typeKey: string;
  typeModules: unknown[];
  isTypeExpanded: boolean;
  expandedModules: Set<string>;
  onToggleType: (typeKey: string) => void;
  onToggleModule: (moduleId: string) => void;
  onModuleClick: (module: any) => void;
  onSubComponentClick: (path: string) => void;
}

const ModuleTypeItem: React.FC<ModuleTypeItemProps> = ({
  typeKey,
  typeModules,
  isTypeExpanded,
  expandedModules,
  onToggleType,
  onToggleModule,
  onModuleClick,
  onSubComponentClick,
}) => {
  const typeConfig = TYPE_CONFIG[typeKey as keyof typeof TYPE_CONFIG];
  const TypeIcon = typeConfig?.icon || Blocks;

  return (
    <div className="space-y-1">
      {/* Type Header */}
      <button
        onClick={() => onToggleType(typeKey)}
        className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md"
      >
        <div className="flex items-center gap-2">
          <TypeIcon className="h-4 w-4 text-gray-500" />
          <span className="font-medium">{typeConfig?.name || typeKey}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            {typeModules.length}
          </span>
          {isTypeExpanded ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </div>
      </button>

      {/* Type Modules */}
      {isTypeExpanded && (
        <div className="ml-4 space-y-1">
          {typeModules.map((module) => (
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

export default ModuleTypeItem; 