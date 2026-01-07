import React, { useMemo } from 'react';
import { 
  Briefcase, Users, BarChart3, MessageSquare, Brain, Settings,
  Shield, Building, DollarSign, Package, ShoppingCart, Headphones,
  FolderOpen, Target, CheckCircle, GitBranch, BookOpen, Megaphone,
  Globe, Code, Lock, Zap, FileText, Rocket
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSystemModules, SystemModule } from '@/hooks/useSystemModules';
import { Badge } from '@/components/ui/badge';

interface AppCategory {
  name: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  apps: SystemModule[];
}

interface AppTypeSection {
  type: 'super_admin' | 'foundation' | 'business';
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  categories: AppCategory[];
}

// Helper function to get route for a module
const getModuleRoute = (module: SystemModule): string | undefined => {
  const moduleName = module.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  
  const routeMap: Record<string, string> = {
    'ats-core': '/superadmin/ats',
    'companies': '/superadmin/companies',
    'people': '/superadmin/people',
    'ai-orchestration': '/superadmin/ai-orchestration',
    'ai-analytics': '/superadmin/ai-analytics',
    'system-administration-suite': '/superadmin/system-administration-suite',
    'module-registry-deployment': '/superadmin/module-registry-deployment',
    'enterprise-monitoring-audit': '/superadmin/enterprise-monitoring-audit',
    'app-development': '/superadmin/module-development',
    'feature-management': '/superadmin/feature-management',
    'documentation': '/superadmin/documentation',
    'security-dashboard': '/superadmin/security-dashboard',
    'audit-logs': '/superadmin/audit-logs',
    'global-settings': '/superadmin/global-settings',
    'subscription-plans': '/superadmin/subscription-plans',
    'tenants': '/superadmin/tenants',
    'users': '/superadmin/users'
  };

  return routeMap[moduleName] || `/superadmin/${moduleName}`;
};

// Helper function to get category tag info
const getCategoryTagInfo = (categoryName: string): { label: string; color: string } => {
  const tagMap: Record<string, { label: string; color: string }> = {
    'RECRUITMENT': { label: 'Recruitment', color: 'bg-blue-100 text-blue-800' },
    'SALES & CRM': { label: 'Sales & CRM', color: 'bg-red-100 text-red-800' },
    'MARKETING': { label: 'Marketing', color: 'bg-orange-100 text-orange-800' },
    'FINANCE': { label: 'Finance', color: 'bg-teal-100 text-teal-800' },
    'HUMAN RESOURCES': { label: 'HR', color: 'bg-purple-100 text-purple-800' },
    'OPERATIONS': { label: 'Operations', color: 'bg-indigo-100 text-indigo-800' },
    'PROJECT MANAGEMENT': { label: 'Projects', color: 'bg-green-100 text-green-800' },
    'COMMUNICATION': { label: 'Communication', color: 'bg-cyan-100 text-cyan-800' },
    'ANALYTICS & INTELLIGENCE': { label: 'Analytics', color: 'bg-pink-100 text-pink-800' },
    'AI & AUTOMATION': { label: 'AI', color: 'bg-yellow-100 text-yellow-800' },
    'WEBSITES & ECOMMERCE': { label: 'Web & E-commerce', color: 'bg-emerald-100 text-emerald-800' },
    'ADMINISTRATION': { label: 'Administration', color: 'bg-gray-100 text-gray-800' },
    'DEVELOPMENT & INTEGRATION': { label: 'Development', color: 'bg-violet-100 text-violet-800' },
    'COMPLIANCE & SECURITY': { label: 'Compliance & Security', color: 'bg-red-100 text-red-800' },
    'FORMS & TEMPLATES': { label: 'Forms', color: 'bg-slate-100 text-slate-800' },
    'OTHER': { label: 'Other', color: 'bg-gray-100 text-gray-800' }
  };
  
  return tagMap[categoryName] || { label: categoryName, color: 'bg-gray-100 text-gray-800' };
};

// Helper function to get maturity status badge info
const getMaturityStatusInfo = (status?: string): { label: string; color: string; bgColor: string } => {
  switch (status) {
    case 'production':
      return { label: 'Production', color: 'text-green-700', bgColor: 'bg-green-100 border-green-300' };
    case 'beta':
      return { label: 'Beta', color: 'text-blue-700', bgColor: 'bg-blue-100 border-blue-300' };
    case 'alpha':
      return { label: 'Alpha', color: 'text-yellow-700', bgColor: 'bg-yellow-100 border-yellow-300' };
    case 'planning':
      return { label: 'Planning', color: 'text-gray-700', bgColor: 'bg-gray-100 border-gray-300' };
    default:
      return { label: 'Unknown', color: 'text-gray-700', bgColor: 'bg-gray-100 border-gray-300' };
  }
};

// Helper function to get AI level badge info
const getAILevelInfo = (level?: string): { label: string; color: string; bgColor: string } | null => {
  if (!level || level === 'none') return null;
  
  switch (level) {
    case 'high':
      return { label: 'High AI', color: 'text-purple-700', bgColor: 'bg-purple-100 border-purple-300' };
    case 'medium':
      return { label: 'Medium AI', color: 'text-indigo-700', bgColor: 'bg-indigo-100 border-indigo-300' };
    case 'low':
      return { label: 'Low AI', color: 'text-blue-700', bgColor: 'bg-blue-100 border-blue-300' };
    default:
      return null;
  }
};

// Helper function to get display category name
const getDisplayCategoryName = (rawCategory: string, moduleName: string = ''): string => {
  let categoryKey = rawCategory.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
  const nameLower = moduleName.toLowerCase();
  
  if (categoryKey.includes('analytics') || categoryKey.includes('intelligence') || 
      categoryKey.includes('bi') || categoryKey.includes('business_intelligence') ||
      nameLower.includes('analytics') || nameLower.includes('intelligence')) {
    return 'ANALYTICS & INTELLIGENCE';
  }
  
  if (categoryKey.includes('monitoring') || categoryKey.includes('compliance') || 
      categoryKey.includes('security') || categoryKey.includes('audit') ||
      nameLower.includes('monitoring') || nameLower.includes('audit') || 
      nameLower.includes('security') || nameLower.includes('compliance')) {
    return 'COMPLIANCE & SECURITY';
  }
  
  if (categoryKey.includes('integration') || categoryKey.includes('platform') || 
      categoryKey.includes('development') || categoryKey.includes('registry') ||
      nameLower.includes('integration') || nameLower.includes('platform') ||
      nameLower.includes('registry') || nameLower.includes('deployment')) {
    return 'DEVELOPMENT & INTEGRATION';
  }
  
  if (categoryKey.includes('ai') || categoryKey.includes('automation') || 
      categoryKey.includes('cognitive') || categoryKey.includes('orchestration') ||
      nameLower.includes('ai') || nameLower.includes('automation') ||
      nameLower.includes('cognitive') || nameLower.includes('orchestration')) {
    return 'AI & AUTOMATION';
  }
  
  if (categoryKey.includes('form') || categoryKey.includes('template') || 
      categoryKey.includes('content_infrastructure') ||
      nameLower.includes('form') || nameLower.includes('template')) {
    return 'FORMS & TEMPLATES';
  }
  
  const directMap: Record<string, string> = {
    'recruitment': 'RECRUITMENT',
    'ats': 'RECRUITMENT',
    'talent': 'RECRUITMENT',
    'sales': 'SALES & CRM',
    'crm': 'SALES & CRM',
    'marketing': 'MARKETING',
    'finance': 'FINANCE',
    'financial': 'FINANCE',
    'human_resources': 'HUMAN RESOURCES',
    'hr': 'HUMAN RESOURCES',
    'operations': 'OPERATIONS',
    'manufacturing': 'OPERATIONS',
    'inventory': 'OPERATIONS',
    'supply_chain': 'OPERATIONS',
    'project_management': 'PROJECT MANAGEMENT',
    'projects': 'PROJECT MANAGEMENT',
    'communication': 'COMMUNICATION',
    'websites': 'WEBSITES & ECOMMERCE',
    'ecommerce': 'WEBSITES & ECOMMERCE',
    'administration': 'ADMINISTRATION',
    'admin': 'ADMINISTRATION'
  };
  
  return directMap[categoryKey] || 'OTHER';
};

// Helper function to organize modules by type and category
const organizeModulesByType = (modules: SystemModule[]): AppTypeSection[] => {
  const typeSections: Record<string, {
    type: 'super_admin' | 'foundation' | 'business';
    name: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    categories: Record<string, AppCategory>;
  }> = {
    'super_admin': {
      type: 'super_admin',
      name: 'Super Admin Apps',
      description: 'Platform administration and system management. Used by platform administrators and IT teams to manage users, security, system settings, and monitor the entire platform.',
      icon: Shield,
      color: 'bg-purple-600',
      categories: {}
    },
    'foundation': {
      type: 'foundation',
      name: 'Foundation Apps',
      description: 'Core infrastructure apps that power all other apps. Used by developers and system integrators to build integrations, manage communications, analytics, and AI capabilities that other apps depend on.',
      icon: Settings,
      color: 'bg-blue-600',
      categories: {}
    },
    'business': {
      type: 'business',
      name: 'Business Apps',
      description: 'End-user business applications for daily operations. Used by business teams, managers, and employees to manage sales, marketing, finance, projects, operations, and other business functions.',
      icon: Building,
      color: 'bg-green-600',
      categories: {}
    }
  };

  const categoryDisplayMap: Record<string, { name: string; color: string; icon: any }> = {
    'RECRUITMENT': { name: 'RECRUITMENT', color: 'bg-blue-600', icon: Briefcase },
    'SALES & CRM': { name: 'SALES & CRM', color: 'bg-red-600', icon: Target },
    'MARKETING': { name: 'MARKETING', color: 'bg-orange-600', icon: Megaphone },
    'FINANCE': { name: 'FINANCE', color: 'bg-teal-600', icon: DollarSign },
    'HUMAN RESOURCES': { name: 'HUMAN RESOURCES', color: 'bg-purple-600', icon: Users },
    'OPERATIONS': { name: 'OPERATIONS', color: 'bg-indigo-600', icon: Package },
    'PROJECT MANAGEMENT': { name: 'PROJECT MANAGEMENT', color: 'bg-green-600', icon: FolderOpen },
    'COMMUNICATION': { name: 'COMMUNICATION', color: 'bg-cyan-600', icon: MessageSquare },
    'ANALYTICS & INTELLIGENCE': { name: 'ANALYTICS & INTELLIGENCE', color: 'bg-pink-600', icon: BarChart3 },
    'AI & AUTOMATION': { name: 'AI & AUTOMATION', color: 'bg-yellow-600', icon: Brain },
    'WEBSITES & ECOMMERCE': { name: 'WEBSITES & ECOMMERCE', color: 'bg-emerald-600', icon: Globe },
    'ADMINISTRATION': { name: 'ADMINISTRATION', color: 'bg-gray-700', icon: Shield },
    'DEVELOPMENT & INTEGRATION': { name: 'DEVELOPMENT & INTEGRATION', color: 'bg-violet-600', icon: Code },
    'COMPLIANCE & SECURITY': { name: 'COMPLIANCE & SECURITY', color: 'bg-red-700', icon: Lock },
    'FORMS & TEMPLATES': { name: 'FORMS & TEMPLATES', color: 'bg-slate-600', icon: FileText },
    'OTHER': { name: 'OTHER', color: 'bg-gray-600', icon: Settings }
  };

  modules.forEach((module) => {
    const moduleType = module.type || 'business';
    const typeSection = typeSections[moduleType];
    
    if (!typeSection) return;
    
    let categoryKey = module.category || '';
    
    if (!categoryKey && module.type) {
      if (module.type === 'super_admin') {
        categoryKey = 'administration';
      } else if (module.type === 'foundation') {
        const name = module.name.toLowerCase();
        if (name.includes('ai') || name.includes('cognitive')) {
          categoryKey = 'ai_infrastructure';
        } else if (name.includes('communication') || name.includes('email')) {
          categoryKey = 'communication';
        } else if (name.includes('integration')) {
          categoryKey = 'integration';
        } else if (name.includes('analytics')) {
          categoryKey = 'analytics_infrastructure';
        } else if (name.includes('form') || name.includes('template')) {
          categoryKey = 'content_infrastructure';
        }
      }
    }
    
    const displayCategoryName = getDisplayCategoryName(categoryKey, module.name);
    const categoryInfo = categoryDisplayMap[displayCategoryName];
    
    if (!typeSection.categories[displayCategoryName]) {
      typeSection.categories[displayCategoryName] = {
        name: categoryInfo.name,
        color: categoryInfo.color,
        icon: categoryInfo.icon,
        apps: []
      };
    }
    
    if (!typeSection.categories[displayCategoryName].apps.find(app => app.id === module.id)) {
      typeSection.categories[displayCategoryName].apps.push(module);
    }
  });

  // Convert to array and sort
  return Object.values(typeSections)
    .filter(section => Object.keys(section.categories).length > 0)
    .map(section => ({
      ...section,
      categories: Object.values(section.categories)
        .map(cat => ({
          ...cat,
          apps: cat.apps.sort((a, b) => a.name.localeCompare(b.name))
        }))
        .sort((a, b) => {
          if (a.name === 'OTHER') return 1;
          if (b.name === 'OTHER') return -1;
          return a.name.localeCompare(b.name);
        })
    }));
};

const AppsShowcase: React.FC = () => {
  const { data: modules = [], isLoading } = useSystemModules(false);

  const typeSections = useMemo(() => {
    if (!modules || modules.length === 0) return [];
    return organizeModulesByType(modules);
  }, [modules]);

  if (isLoading) {
    return (
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading apps...</p>
          </div>
        </div>
      </div>
    );
  }

  if (typeSections.length === 0) {
    return (
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">No apps available at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            All Apps in One Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Total Recall AI brings together all the apps you need to run your business efficiently. 
            From recruitment to finance, marketing to operations - everything in one integrated platform.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Showing {modules.length} apps organized by type and category
          </p>
        </div>

        {/* Type Sections */}
        <div className="space-y-12">
          {typeSections.map((typeSection) => {
            const TypeIcon = typeSection.icon;
            return (
              <div key={typeSection.type} className="space-y-6">
                {/* Type Header */}
                <div className={`${typeSection.color} text-white px-6 py-4 rounded-lg`}>
                  <div className="flex items-start gap-3">
                    <TypeIcon className="h-6 w-6 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2">{typeSection.name}</h3>
                      <p className="text-sm text-white/90 leading-relaxed">{typeSection.description}</p>
                    </div>
                  </div>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {typeSection.categories.map((category) => {
                    const CategoryIcon = category.icon;
                    return (
                      <div key={category.name} className="space-y-4">
                        {/* Category Header */}
                        <div className={`${category.color} text-white px-4 py-3 rounded-lg`}>
                          <div className="flex items-center gap-2">
                            <CategoryIcon className="h-5 w-5" />
                            <h4 className="font-bold text-sm uppercase tracking-wide">
                              {category.name}
                            </h4>
                            <Badge variant="secondary" className="ml-auto text-xs bg-white/20 text-white border-white/30">
                              {category.apps.length} {category.apps.length === 1 ? 'app' : 'apps'}
                            </Badge>
                          </div>
                        </div>
                        
                        {/* Apps Cards */}
                        <div className="space-y-3">
                          {category.apps.map((app) => {
                            const route = getModuleRoute(app);
                            const maturityInfo = getMaturityStatusInfo(app.maturity_status);
                            const aiLevelInfo = getAILevelInfo(app.ai_level);
                            
                            // Create subscription link with app context
                            const subscriptionLink = `/subscribe?app=${encodeURIComponent(app.name)}`;
                            
                            const AppCard = (
                              <div className="bg-white rounded-lg border border-gray-200 p-4 hover:border-indigo-300 hover:shadow-md transition-all">
                                {/* App Header */}
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1 min-w-0">
                                    <Link
                                      to={subscriptionLink}
                                      className="block"
                                    >
                                      <h5 className="font-semibold text-sm text-gray-900 hover:text-indigo-600 transition-colors line-clamp-1">
                                        {app.name}
                                      </h5>
                                    </Link>
                                  </div>
                                  {!app.is_active && (
                                    <Badge variant="outline" className="text-xs border-red-300 text-red-700 ml-2 flex-shrink-0">
                                      Inactive
                                    </Badge>
                                  )}
                                </div>
                                
                                {/* Description */}
                                {app.description && (
                                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                                    {app.description}
                                  </p>
                                )}
                                
                                {/* Badges */}
                                <div className="flex items-center gap-2 flex-wrap">
                                  {/* Maturity Status */}
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs ${maturityInfo.bgColor} ${maturityInfo.color} border`}
                                  >
                                    {maturityInfo.label}
                                  </Badge>
                                  
                                  {/* AI Level */}
                                  {aiLevelInfo && (
                                    <Badge 
                                      variant="outline" 
                                      className={`text-xs ${aiLevelInfo.bgColor} ${aiLevelInfo.color} border`}
                                    >
                                      <Brain className="h-3 w-3 mr-1 inline" />
                                      {aiLevelInfo.label}
                                    </Badge>
                                  )}
                                  
                                  {/* Version */}
                                  {app.version && (
                                    <Badge variant="outline" className="text-xs">
                                      v{app.version}
                                    </Badge>
                                  )}
                                </div>
                                
                                {/* AI Capabilities Preview */}
                                {app.ai_capabilities && app.ai_capabilities.length > 0 && (
                                  <div className="mt-2 pt-2 border-t border-gray-100">
                                    <p className="text-xs text-gray-500 mb-1">AI Features:</p>
                                    <div className="flex flex-wrap gap-1">
                                      {app.ai_capabilities.slice(0, 2).map((capability, idx) => (
                                        <span key={idx} className="text-xs text-gray-600 bg-gray-50 px-2 py-0.5 rounded">
                                          {capability}
                                        </span>
                                      ))}
                                      {app.ai_capabilities.length > 2 && (
                                        <span className="text-xs text-gray-500">
                                          +{app.ai_capabilities.length - 2} more
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                            
                            return (
                              <div key={app.id}>
                                {AppCard}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>Third Party Apps</span>
            </div>
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              <span>TotalRecall Studio</span>
            </div>
            <div className="flex items-center gap-2">
              <Rocket className="h-4 w-4" />
              <span>TotalRecall Cloud Platform</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppsShowcase;
