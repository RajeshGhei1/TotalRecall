
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
  const { data: modules, isLoading } = useSystemModules(false); // Get all modules, not just active ones

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

  // Sort categories for consistent display
  const sortedCategories = Object.keys(modulesByCategory).sort();

  // Format category name for display
  const formatCategoryName = (category: string) => {
    return category.replace(/_/g, ' ').toUpperCase();
  };

  return (
    <>
      {/* Modules parent item */}
      <div
        className={cn(
          "flex items-center justify-between w-full px-3 py-2.5 text-sm rounded-lg cursor-pointer transition-all duration-200",
          isModulesActive() || isExpanded
            ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-200"
            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
        )}
        onClick={onToggle}
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-5 h-5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <span className="font-medium">Modules</span>
        </div>
        <div className="flex items-center space-x-2">
          {isLoading && (
            <div className="w-4 h-4 animate-spin border-2 border-gray-300 border-t-blue-500 rounded-full" />
          )}
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
            {modules?.length || 0}
          </span>
          <div className="transition-transform duration-200">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded module list */}
      {isExpanded && (
        <div className="ml-3 mt-2 space-y-3 border-l-2 border-gray-100 pl-3">
          {sortedCategories.map((category) => (
            <div key={category} className="space-y-1">
              {/* Category header */}
              <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-md">
                <h4 className="text-xs font-bold text-gray-700 tracking-wider">
                  {formatCategoryName(category)}
                </h4>
                <span className="text-xs bg-white text-gray-500 px-2 py-0.5 rounded-full font-medium border">
                  {modulesByCategory[category].length}
                </span>
              </div>
              
              {/* Modules in category */}
              <div className="space-y-1">
                {modulesByCategory[category].map((module) => (
                  <Link
                    key={module.id}
                    to={getModuleRoute(module.name)}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 text-sm rounded-md transition-all duration-200 ml-2 group",
                      isModuleActive(module.name)
                        ? "bg-blue-100 text-blue-800 border-l-3 border-blue-500 shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm border-l-3 border-transparent"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "w-2 h-2 rounded-full transition-colors",
                        module.is_active 
                          ? "bg-green-500" 
                          : "bg-gray-300"
                      )} />
                      <span className="font-medium truncate group-hover:text-gray-900">
                        {getDisplayName(module.name)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!module.is_active && (
                        <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full border border-orange-200 font-medium">
                          Inactive
                        </span>
                      )}
                      <div className="w-1 h-1 rounded-full bg-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
          
          {sortedCategories.length === 0 && !isLoading && (
            <div className="px-3 py-4 text-center">
              <div className="text-gray-400 mb-1">
                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m0 0h8m-8 0v-5a2 2 0 012-2h8a2 2 0 012 2v5" />
                </svg>
              </div>
              <p className="text-sm text-gray-500 font-medium">No modules available</p>
              <p className="text-xs text-gray-400 mt-1">Create modules in Module Development</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ModuleNavigationItem;
