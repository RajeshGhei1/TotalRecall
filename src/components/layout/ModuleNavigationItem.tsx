
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSystemModules } from '@/hooks/useSystemModules';
import { getDisplayName } from '@/utils/moduleNameMapping';
import { 
  ChevronDown, 
  ChevronRight, 
  Blocks,
  Users,
  BarChart3,
  MessageSquare,
  Brain,
  Settings,
  Briefcase,
  Zap
} from 'lucide-react';

// Category configuration with icons and no descriptions
const CATEGORY_CONFIG = {
  'recruitment': {
    name: 'Recruitment',
    icon: Briefcase,
  },
  'business': {
    name: 'Business',
    icon: Users,
  },
  'analytics': {
    name: 'Analytics',
    icon: BarChart3,
  },
  'communication': {
    name: 'Communication',
    icon: MessageSquare,
  },
  'ai_tools': {
    name: 'AI Tools',
    icon: Brain,
  },
  'core_system': {
    name: 'Core System',
    icon: Settings,
  },
  'ai_analytics': {
    name: 'AI-Analytics',
    icon: Zap,
  },
  'ai_automation': {
    name: 'AI-Automation',
    icon: Zap,
  },
  'ai_cognitive': {
    name: 'AI-Cognitive',
    icon: Zap,
  },
  'ai_core': {
    name: 'AI-Core',
    icon: Zap,
  },
  'ai_knowledge': {
    name: 'AI-Knowledge',
    icon: Zap,
  }
};

// Module sub-components mapping
const MODULE_SUB_COMPONENTS = {
  'ats_core': [
    { name: 'Jobs', path: '/superadmin/ats/jobs' },
    { name: 'Candidates', path: '/superadmin/ats/candidates' },
    { name: 'Applications', path: '/superadmin/ats/applications' },
    { name: 'Analytics', path: '/superadmin/ats/analytics' }
  ],
  'companies': [
    { name: 'Company Database', path: '/superadmin/companies' },
    { name: 'Relationships', path: '/superadmin/companies/relationships' },
    { name: 'Analytics', path: '/superadmin/companies/analytics' }
  ],
  'people': [
    { name: 'People Database', path: '/superadmin/people' },
    { name: 'Skills Management', path: '/super admin/people/skills' },
    { name: 'Reporting', path: '/superadmin/people/reporting' }
  ]
};

interface ModuleNavigationItemProps {
  isExpanded: boolean;
  onToggle: () => void;
}

const ModuleNavigationItem: React.FC<ModuleNavigationItemProps> = ({
  isExpanded,
  onToggle,
}) => {
  const { data: modules, isLoading } = useSystemModules(true, 'production');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const location = useLocation();
  const navigate = useNavigate();

  // Group modules by category
  const groupedModules = React.useMemo(() => {
    if (!modules) return {};
    
    const grouped: Record<string, any[]> = {};
    
    modules.forEach(module => {
      let category = 'core_system'; // default category
      
      // Categorize modules based on their names and functionality
      const moduleName = module.name.toLowerCase();
      
      if (moduleName.includes('ats') || moduleName.includes('candidate') || 
          moduleName.includes('job') || moduleName.includes('recruitment') ||
          moduleName.includes('interview') || moduleName.includes('talent')) {
        category = 'recruitment';
      } else if (moduleName.includes('company') || moduleName.includes('people') ||
                 moduleName.includes('business')) {
        category = 'business';
      } else if (moduleName.includes('analytic') || moduleName.includes('report') ||
                 moduleName.includes('insight') || moduleName.includes('metric')) {
        category = 'analytics';
      } else if (moduleName.includes('email') || moduleName.includes('notification') ||
                 moduleName.includes('communication') || moduleName.includes('collaboration')) {
        category = 'communication';
      } else if (moduleName.startsWith('ai_analytics')) {
        category = 'ai_analytics';
      } else if (moduleName.startsWith('ai_automation')) {
        category = 'ai_automation';
      } else if (moduleName.startsWith('ai_cognitive')) {
        category = 'ai_cognitive';
      } else if (moduleName.startsWith('ai_core')) {
        category = 'ai_core';
      } else if (moduleName.startsWith('ai_knowledge')) {
        category = 'ai_knowledge';
      } else if (moduleName.includes('ai') || moduleName.includes('smart') ||
                 moduleName.includes('predict')) {
        category = 'ai_tools';
      }
      
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(module);
    });
    
    return grouped;
  }, [modules]);

  const toggleCategory = (categoryKey: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryKey)) {
      newExpanded.delete(categoryKey);
    } else {
      newExpanded.add(categoryKey);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const handleModuleClick = (module: any) => {
    const moduleSlug = module.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    // Check if module has dedicated page
    if (module.name === 'ats_core' || moduleSlug === 'ats-core') {
      navigate('/superadmin/ats-core');
    } else if (module.name === 'companies') {
      navigate('/superadmin/companies');
    } else if (module.name === 'people') {
      navigate('/superadmin/people');
    } else {
      // Navigate to dynamic module page
      navigate(`/superadmin/${moduleSlug}`);
    }
  };

  const handleSubComponentClick = (path: string) => {
    navigate(path);
  };

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
        <div className="ml-2 mt-1 space-y-1">
          {Object.entries(groupedModules).map(([categoryKey, categoryModules]) => {
            const categoryConfig = CATEGORY_CONFIG[categoryKey];
            const isCategoryExpanded = expandedCategories.has(categoryKey);
            const CategoryIcon = categoryConfig?.icon || Blocks;

            return (
              <div key={categoryKey} className="space-y-1">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(categoryKey)}
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
                    {categoryModules.map((module) => {
                      const hasSubComponents = MODULE_SUB_COMPONENTS[module.name];
                      const isModuleExpanded = expandedModules.has(module.id);

                      return (
                        <div key={module.id} className="space-y-1">
                          {/* Module Item */}
                          <div className="flex items-center">
                            <button
                              onClick={() => handleModuleClick(module)}
                              className="flex-1 flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                            >
                              <div className={`w-2 h-2 rounded-full ${module.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                              <span>{getDisplayName(module.name)}</span>
                            </button>
                            {hasSubComponents && (
                              <button
                                onClick={() => toggleModule(module.id)}
                                className="p-1 hover:bg-gray-100 rounded"
                              >
                                {isModuleExpanded ? (
                                  <ChevronDown className="h-3 w-3" />
                                ) : (
                                  <ChevronRight className="h-3 w-3" />
                                )}
                              </button>
                            )}
                          </div>

                          {/* Sub-components */}
                          {hasSubComponents && isModuleExpanded && (
                            <div className="ml-6 space-y-1">
                              {MODULE_SUB_COMPONENTS[module.name].map((subComponent, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleSubComponentClick(subComponent.path)}
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
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ModuleNavigationItem;
