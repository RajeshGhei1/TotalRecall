
import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { getDisplayName } from '@/utils/moduleNameMapping';
import { normalizeModuleName } from './utils';
import { MODULE_SUB_COMPONENTS } from './constants';

interface ModuleItemProps {
  module: any;
  isExpanded: boolean;
  onToggle: () => void;
  onModuleClick: (module: unknown) => void;
  onSubComponentClick: (path: string) => void;
}

const ModuleItem: React.FC<ModuleItemProps> = ({
  module,
  isExpanded,
  onToggle,
  onModuleClick,
  onSubComponentClick,
}) => {
  // Normalize the module name to check for sub-components
  const normalizedModuleName = normalizeModuleName(module.name);
  const hasSubComponents = MODULE_SUB_COMPONENTS[normalizedModuleName];

  return (
    <div className="space-y-1">
      {/* Module Item */}
      <div className="flex items-center">
        <button
          onClick={() => onModuleClick(module)}
          className="flex-1 flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
        >
          <div className={`w-2 h-2 rounded-full ${module.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
          <span>{getDisplayName(module.name)}</span>
        </button>
        {hasSubComponents && (
          <button
            onClick={onToggle}
            className="p-1 hover:bg-gray-100 rounded"
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </button>
        )}
      </div>

      {/* Sub-components */}
      {hasSubComponents && isExpanded && (
        <div className="ml-6 space-y-1">
          {MODULE_SUB_COMPONENTS[normalizedModuleName].map((subComponent, index) => (
            <button
              key={index}
              onClick={() => onSubComponentClick(subComponent.path)}
              className="flex items-center gap-2 w-full px-3 py-1 text-xs text-gray-600 hover:bg-gray-50 rounded-md"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span>{subComponent.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModuleItem;
