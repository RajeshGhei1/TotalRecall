
import React from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { SystemModule } from '@/hooks/useSystemModules';
import { normalizeModuleName } from './utils';
import { MODULE_SUB_COMPONENTS } from './constants';
import { getDisplayName } from '@/utils/moduleNameMapping';

interface ModuleItemProps {
  module: SystemModule;
  isExpanded: boolean;
  onToggle: () => void;
  onModuleClick: (module: SystemModule) => void;
  onSubComponentClick: (path: string) => void;
  getModuleStatus: (module: SystemModule) => {
    status: string;
    color: string;
    label: string;
    description: string;
  };
}

const ModuleItem: React.FC<ModuleItemProps> = ({
  module,
  isExpanded,
  onToggle,
  onModuleClick,
  onSubComponentClick,
  getModuleStatus,
}) => {
  // Normalize the module name to check for sub-components
  const normalizedModuleName = normalizeModuleName(module.name);
  const hasSubComponents = MODULE_SUB_COMPONENTS[normalizedModuleName];
  const statusInfo = getModuleStatus(module);

  return (
    <div className="space-y-1">
      {/* Module Item with Status Indicators */}
      <div className="flex items-center group">
        <button
          onClick={() => onModuleClick(module)}
          className="flex-1 flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
          title={`${module.name} - ${statusInfo.description}`}
        >
          {/* Status Indicator Dot */}
          <div className={`w-2.5 h-2.5 rounded-full ${statusInfo.color} flex-shrink-0`} />
          
          {/* Module Name */}
          <span className={`truncate ${
            statusInfo.status === 'production' ? 'font-medium' : 'font-normal'
          } ${
            statusInfo.status === 'inactive' ? 'text-gray-400' : 'text-gray-700'
          }`}>
            {getDisplayName(module.name)}
          </span>
          
          {/* Status Badge (appears on hover) */}
          <span className={`
            opacity-0 group-hover:opacity-100 transition-opacity
            text-xs px-2 py-0.5 rounded-full text-white font-medium flex-shrink-0
            ${statusInfo.color}
          `}>
            {statusInfo.label}
          </span>
        </button>
        
        {/* Expand/Collapse Button for Sub-components */}
        {hasSubComponents && (
          <button
            onClick={onToggle}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Toggle sub-components"
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
              className="flex items-center gap-2 w-full px-3 py-1 text-xs text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
              title={`${subComponent.name} - ${module.name} sub-component`}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
              <span className="truncate">{subComponent.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModuleItem;
