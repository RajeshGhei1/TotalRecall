import React, { useMemo } from 'react';
import { 
  Briefcase, Building, Heart, GraduationCap, Factory, ShoppingBag,
  Stethoscope, Scale, Truck, Home, UtensilsCrossed, Code
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSystemModules, SystemModule } from '@/hooks/useSystemModules';

interface Industry {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
  relevantCategories: string[];
  relevantTypes: string[];
  apps: SystemModule[];
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

// Map modules to industries based on their categories and types
const mapModulesToIndustries = (modules: SystemModule[]): Industry[] => {
  const industries: Industry[] = [
    {
      name: 'Recruitment & Staffing',
      icon: Briefcase,
      color: 'bg-blue-600',
      description: 'Complete talent acquisition and management solutions',
      relevantCategories: ['recruitment', 'ats', 'talent'],
      relevantTypes: ['business'],
      apps: []
    },
    {
      name: 'Healthcare',
      icon: Stethoscope,
      color: 'bg-red-600',
      description: 'Healthcare management and patient care solutions',
      relevantCategories: ['healthcare', 'medical', 'patient'],
      relevantTypes: ['business'],
      apps: []
    },
    {
      name: 'Manufacturing',
      icon: Factory,
      color: 'bg-orange-600',
      description: 'Production, quality, and supply chain management',
      relevantCategories: ['operations', 'manufacturing', 'inventory', 'supply_chain'],
      relevantTypes: ['business'],
      apps: []
    },
    {
      name: 'Retail & E-commerce',
      icon: ShoppingBag,
      color: 'bg-purple-600',
      description: 'Online and offline retail operations',
      relevantCategories: ['commerce', 'sales', 'marketing', 'ecommerce'],
      relevantTypes: ['business'],
      apps: []
    },
    {
      name: 'Professional Services',
      icon: Building,
      color: 'bg-teal-600',
      description: 'Consulting, legal, and professional service firms',
      relevantCategories: ['project_management', 'operations', 'finance', 'analytics'],
      relevantTypes: ['business'],
      apps: []
    },
    {
      name: 'Education',
      icon: GraduationCap,
      color: 'bg-green-600',
      description: 'Schools, universities, and training organizations',
      relevantCategories: ['education', 'learning', 'training'],
      relevantTypes: ['business', 'foundation'],
      apps: []
    },
    {
      name: 'Real Estate',
      icon: Home,
      color: 'bg-indigo-600',
      description: 'Property management and real estate operations',
      relevantCategories: ['sales', 'operations', 'analytics'],
      relevantTypes: ['business'],
      apps: []
    },
    {
      name: 'Hospitality',
      icon: UtensilsCrossed,
      color: 'bg-pink-600',
      description: 'Hotels, restaurants, and hospitality services',
      relevantCategories: ['operations', 'sales', 'marketing'],
      relevantTypes: ['business'],
      apps: []
    },
    {
      name: 'Financial Services',
      icon: Scale,
      color: 'bg-yellow-600',
      description: 'Banking, insurance, and financial institutions',
      relevantCategories: ['finance', 'compliance', 'analytics'],
      relevantTypes: ['business'],
      apps: []
    },
    {
      name: 'Technology & Software',
      icon: Code,
      color: 'bg-violet-600',
      description: 'Software companies and tech startups',
      relevantCategories: ['integration', 'platform', 'ai_infrastructure', 'automation'],
      relevantTypes: ['foundation', 'super_admin'],
      apps: []
    },
    {
      name: 'Non-Profit',
      icon: Heart,
      color: 'bg-rose-600',
      description: 'Charities and non-profit organizations',
      relevantCategories: ['operations', 'analytics', 'communication'],
      relevantTypes: ['business', 'foundation'],
      apps: []
    },
    {
      name: 'Transportation & Logistics',
      icon: Truck,
      color: 'bg-cyan-600',
      description: 'Shipping, logistics, and transportation companies',
      relevantCategories: ['operations', 'integration', 'analytics'],
      relevantTypes: ['business'],
      apps: []
    }
  ];

  // Map modules to industries
  modules.forEach((module) => {
    const moduleCategory = (module.category || '').toLowerCase();
    const moduleType = module.type || '';
    const moduleName = module.name.toLowerCase();

    industries.forEach((industry) => {
      const categoryMatch = industry.relevantCategories.some(cat => 
        moduleCategory.includes(cat) || moduleName.includes(cat)
      );
      const typeMatch = industry.relevantTypes.includes(moduleType);
      
      // Also check if module name contains industry keywords
      const nameMatch = industry.relevantCategories.some(cat => 
        moduleName.includes(cat)
      );

      if (categoryMatch || (typeMatch && nameMatch) || 
          (moduleType === 'foundation' && industry.name === 'Technology & Software') ||
          (moduleType === 'super_admin' && industry.name === 'Technology & Software')) {
        // Check if not already added
        if (!industry.apps.find(app => app.id === module.id)) {
          industry.apps.push(module);
        }
      }
    });
  });

  // Filter out industries with no apps and sort apps within each industry
  return industries
    .filter(industry => industry.apps.length > 0)
    .map(industry => ({
      ...industry,
      apps: industry.apps.sort((a, b) => a.name.localeCompare(b.name))
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

const IndustriesShowcase: React.FC = () => {
  const { data: modules = [], isLoading } = useSystemModules(false); // Get all modules

  const industries = useMemo(() => {
    if (!modules || modules.length === 0) return [];
    return mapModulesToIndustries(modules);
  }, [modules]);

  if (isLoading) {
    return (
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading industry solutions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (industries.length === 0) {
    return (
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">No industry solutions available at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Solutions for Every Industry
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Total Recall AI is tailored to meet the unique needs of your industry. 
            Discover industry-specific apps and solutions designed to drive your business forward.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Showing {industries.length} industries with {modules.length} available apps
          </p>
        </div>

        {/* Industries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((industry, index) => {
            const IconComponent = industry.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
              >
                {/* Industry Header */}
                <div className={`${industry.color} text-white px-6 py-4`}>
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-6 w-6" />
                    <div>
                      <h3 className="text-xl font-bold">{industry.name}</h3>
                      <p className="text-sm text-white/90 mt-1">{industry.description}</p>
                    </div>
                  </div>
                </div>

                {/* Apps List */}
                <div className="p-6 space-y-3">
                  {industry.apps.slice(0, 8).map((app) => {
                    // Create subscription link with app context
                    const subscriptionLink = `/subscribe?app=${encodeURIComponent(app.name)}`;
                    
                    return (
                      <div key={app.id} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                        <Link
                          to={subscriptionLink}
                          className="block group"
                        >
                          <div className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {app.name}
                          </div>
                          {app.description && (
                            <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {app.description}
                            </div>
                          )}
                        </Link>
                      </div>
                    );
                  })}
                  {industry.apps.length > 8 && (
                    <div className="text-sm text-gray-500 pt-2">
                      +{industry.apps.length - 8} more apps
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <p className="text-lg text-gray-600 mb-6">
            Don't see your industry? Our platform is highly customizable.
          </p>
          <Link to="/auth">
            <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
              Get Started Today
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IndustriesShowcase;
