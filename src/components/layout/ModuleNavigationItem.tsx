
import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useSystemModules } from '@/hooks/useSystemModules';
import { getDisplayName } from '@/utils/moduleNameMapping';
import { cn } from '@/lib/utils';

interface ModuleNavigationItemProps {
  isExpanded: boolean;
  onToggle: () => void;
}

const ModuleNavigationItem: React.FC<ModuleNavigationItemProps> = ({ isExpanded, onToggle }) => {
  const location = useLocation();
  const { data: modules, isLoading } = useSystemModules(true, 'production'); // Get all production modules

  // Group modules by category
  const modulesByCategory = React.useMemo(() => {
    if (!modules) return {};
    
    return modules.reduce((acc, module) => {
      const category = module.category || 'other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(module);
      return acc;
    }, {} as Record<string, typeof modules>);
  }, [modules]);

  // Generate module route from module name
  const getModuleRoute = (moduleName: string) => {
    const routeName = moduleName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return `/superadmin/${routeName}`;
  };

  const isModuleActive = (moduleName: string) => {
    const moduleRoute = getModuleRoute(moduleName);
    return location.pathname === moduleRoute;
  };

  const isModulesActive = () => {
    return Object.values(modulesByCategory).flat().some(module => 
      isModuleActive(module.name)
    );
  };

  return (
    <>
      {/* Modules parent item */}
      <div
        className={cn(
          "flex items-center justify-between w-full px-3 py-2 text-sm rounded-md cursor-pointer transition-colors",
          isModulesActive() || isExpanded
            ? "bg-blue-100 text-blue-900"
            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        )}
        onClick={onToggle}
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-5 h-5">
            {/* Blocks icon placeholder - will be handled by parent */}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <span className="font-medium">Modules</span>
        </div>
        <div className="flex items-center">
          {isLoading && (
            <div className="w-4 h-4 animate-spin border-2 border-gray-300 border-t-blue-500 rounded-full mr-2" />
          )}
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </div>
      </div>

      {/* Expanded module list */}
      {isExpanded && (
        <div className="ml-6 mt-1 space-y-1">
          {Object.entries(modulesByCategory).map(([category, categoryModules]) => (
            <div key={category} className="space-y-1">
              {/* Category header */}
              <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {category.replace('_', ' ')}
              </div>
              
              {/* Modules in category */}
              {categoryModules.map((module) => (
                <Link
                  key={module.id}
                  to={getModuleRoute(module.name)}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm rounded-md transition-colors ml-4",
                    isModuleActive(module.name)
                      ? "bg-blue-50 text-blue-700 border-l-2 border-blue-500"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <div className="flex items-center space-x-3 w-full">
                    <div className="w-2 h-2 rounded-full bg-current opacity-50" />
                    <span className="truncate">{getDisplayName(module.name)}</span>
                    {!module.is_active && (
                      <span className="text-xs px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded">
                        Inactive
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ))}
          
          {Object.keys(modulesByCategory).length === 0 && !isLoading && (
            <div className="px-3 py-2 text-sm text-gray-500 italic">
              No modules available
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ModuleNavigationItem;
