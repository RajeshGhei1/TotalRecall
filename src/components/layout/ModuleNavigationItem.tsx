
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Minus } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useSystemModules } from '@/hooks/useSystemModules';
import { getDisplayName } from '@/utils/moduleNameMapping';
import { cn } from '@/lib/utils';

interface ModuleNavigationItemProps {
  isExpanded: boolean;
  onToggle: () => void;
}

// Define module sub-components mapping
const MODULE_SUB_COMPONENTS: Record<string, { name: string; route: string }[]> = {
  'ats_core': [
    { name: 'Jobs', route: '/superadmin/ats/jobs' },
    { name: 'Candidates', route: '/superadmin/ats/candidates' },
    { name: 'Applications', route: '/superadmin/ats/applications' },
    { name: 'Analytics', route: '/superadmin/ats/analytics' }
  ],
  'talent_database': [
    { name: 'Search', route: '/superadmin/talent/search' },
    { name: 'Favorites', route: '/superadmin/talent/favorites' },
    { name: 'Recent', route: '/superadmin/talent/recent' }
  ],
  'smart_talent_analytics': [
    { name: 'Insights', route: '/superadmin/analytics/insights' },
    { name: 'Patterns', route: '/superadmin/analytics/patterns' },
    { name: 'Predictions', route: '/superadmin/analytics/predictions' }
  ],
  'companies': [
    { name: 'Company List', route: '/superadmin/companies' },
    { name: 'Company Analytics', route: '/superadmin/companies/analytics' },
    { name: 'Relationships', route: '/superadmin/companies/relationships' }
  ],
  'people': [
    { name: 'People List', route: '/superadmin/people' },
    { name: 'Contact Analytics', route: '/superadmin/people/analytics' },
    { name: 'Skills Management', route: '/superadmin/people/skills' }
  ]
};

// Category display names and icons
const CATEGORY_CONFIG = {
  'recruitment': {
    name: 'Recruitment',
    icon: '👥',
    description: 'ATS, talent management, and hiring tools'
  },
  'business': {
    name: 'Business',
    icon: '🏢',
    description: 'Company and people management'
  },
  'analytics': {
    name: 'Analytics',
    icon: '📊',
    description: 'Data insights and reporting'
  },
  'ai': {
    name: 'AI Tools',
    icon: '🤖',
    description: 'AI-powered features and automation'
  },
  'communication': {
    name: 'Communication',
    icon: '💬',
    description: 'Email, notifications, and collaboration'
  },
  'integration': {
    name: 'Integrations',
    icon: '🔗',
    description: 'Third-party connections and APIs'
  },
  'core': {
    name: 'Core System',
    icon: '⚙️',
    description: 'Core platform functionality'
  },
  'workflow': {
    name: 'Workflow',
    icon: '🔄',
    description: 'Process automation and workflows'
  }
};

const ModuleNavigationItem: React.FC<ModuleNavigationItemProps> = ({ isExpanded, onToggle }) => {
  const location = useLocation();
  const { data: modules, isLoading } = useSystemModules(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  // Group modules by category
  const modulesByCategory = React.useMemo(() => {
    if (!modules) return {};
    
    return modules.reduce((acc, module) => {
      const category = module.category || 'core';
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
    return location.pathname === moduleRoute || location.pathname.startsWith(moduleRoute + '/');
  };

  const isSubComponentActive = (route: string) => {
    return location.pathname === route;
  };

  const isCategoryActive = (category: string) => {
    return modulesByCategory[category]?.some(module => isModuleActive(module.name)) || false;
  };

  const isModulesActive = () => {
    return Object.values(modulesByCategory).flat().some(module => 
      isModuleActive(module.name)
    );
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleModule = (moduleId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const hasSubComponents = (moduleName: string) => {
    return MODULE_SUB_COMPONENTS[moduleName]?.length > 0;
  };

  // Sort categories for consistent display
  const sortedCategories = Object.keys(modulesByCategory).sort();

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

      {/* Expanded module hierarchy */}
      {isExpanded && (
        <div className="ml-3 mt-2 space-y-2 border-l-2 border-gray-100 pl-3">
          {sortedCategories.map((category) => {
            const categoryConfig = CATEGORY_CONFIG[category] || {
              name: category.replace('_', ' ').toUpperCase(),
              icon: '📁',
              description: 'Module category'
            };
            const isCatExpanded = expandedCategories.has(category);
            const isCatActive = isCategoryActive(category);

            return (
              <div key={category} className="space-y-1">
                {/* Category header */}
                <div 
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors",
                    isCatActive 
                      ? "bg-blue-50 border border-blue-200" 
                      : "bg-gray-50 hover:bg-gray-100"
                  )}
                  onClick={() => toggleCategory(category)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{categoryConfig.icon}</span>
                    <div>
                      <h4 className="text-sm font-bold text-gray-700">
                        {categoryConfig.name}
                      </h4>
                      <p className="text-xs text-gray-500">{categoryConfig.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-white text-gray-500 px-2 py-0.5 rounded-full font-medium border">
                      {modulesByCategory[category].length}
                    </span>
                    <div className="transition-transform duration-200">
                      {isCatExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Modules in category */}
                {isCatExpanded && (
                  <div className="ml-4 space-y-1">
                    {modulesByCategory[category].map((module) => {
                      const hasSubComps = hasSubComponents(module.name);
                      const isModExpanded = expandedModules.has(module.id);
                      const moduleSubComponents = MODULE_SUB_COMPONENTS[module.name] || [];

                      return (
                        <div key={module.id} className="space-y-1">
                          {/* Module item */}
                          <div className="flex items-center">
                            <Link
                              to={getModuleRoute(module.name)}
                              className={cn(
                                "flex items-center justify-between px-3 py-2.5 text-sm rounded-md transition-all duration-200 group flex-1",
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
                            
                            {/* Expand/collapse button for modules with sub-components */}
                            {hasSubComps && (
                              <button
                                onClick={(e) => toggleModule(module.id, e)}
                                className="ml-1 p-1 rounded hover:bg-gray-200 transition-colors"
                              >
                                {isModExpanded ? (
                                  <Minus className="w-3 h-3 text-gray-500" />
                                ) : (
                                  <Plus className="w-3 h-3 text-gray-500" />
                                )}
                              </button>
                            )}
                          </div>

                          {/* Sub-components */}
                          {hasSubComps && isModExpanded && (
                            <div className="ml-6 space-y-1">
                              {moduleSubComponents.map((subComp) => (
                                <Link
                                  key={subComp.name}
                                  to={subComp.route}
                                  className={cn(
                                    "flex items-center px-3 py-2 text-sm rounded-md transition-all duration-200 group",
                                    isSubComponentActive(subComp.route)
                                      ? "bg-blue-50 text-blue-700 border-l-2 border-blue-400"
                                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-700 border-l-2 border-transparent"
                                  )}
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-3" />
                                  <span className="text-xs font-medium">{subComp.name}</span>
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          
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
