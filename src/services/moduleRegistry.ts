
export interface ModuleDefinition {
  id: string;
  name: string;
  description: string;
  category: 'core' | 'business' | 'recruitment' | 'analytics' | 'ai' | 'integration' | 'communication';
  dependencies: string[];
  route?: string;
  component?: string;
  isCore: boolean;
  pricing?: {
    tier: 'basic' | 'professional' | 'enterprise';
    monthlyPrice: number;
    annualPrice: number;
  };
}

export const MODULE_REGISTRY: Record<string, ModuleDefinition> = {
  // Core modules (always available in super admin)
  'tenant_management': {
    id: 'tenant_management',
    name: 'Tenant Management',
    description: 'Manage tenants and basic settings',
    category: 'core',
    dependencies: [],
    isCore: true
  },
  'subscription_management': {
    id: 'subscription_management',
    name: 'Subscription Management',
    description: 'Manage subscription plans and billing',
    category: 'core',
    dependencies: [],
    isCore: true
  },
  'user_management': {
    id: 'user_management',
    name: 'User Management',
    description: 'Manage users across tenants',
    category: 'core',
    dependencies: [],
    isCore: true
  },
  'security_audit': {
    id: 'security_audit',
    name: 'Security & Audit',
    description: 'Security monitoring and audit logs',
    category: 'core',
    dependencies: [],
    isCore: true
  },
  'global_settings': {
    id: 'global_settings',
    name: 'Global Settings',
    description: 'System-wide configuration',
    category: 'core',
    dependencies: [],
    isCore: true
  },

  // Business modules (subscription-based)
  'companies': {
    id: 'companies',
    name: 'Companies',
    description: 'Company management and relationships',
    category: 'business',
    dependencies: ['user_management'],
    route: '/superadmin/companies',
    isCore: false,
    pricing: {
      tier: 'basic',
      monthlyPrice: 29,
      annualPrice: 290
    }
  },
  'people_contacts': {
    id: 'people_contacts',
    name: 'People & Contacts',
    description: 'Contact and people management',
    category: 'business',
    dependencies: ['user_management'],
    route: '/superadmin/people',
    isCore: false,
    pricing: {
      tier: 'basic',
      monthlyPrice: 19,
      annualPrice: 190
    }
  },
  'basic_reporting': {
    id: 'basic_reporting',
    name: 'Basic Reporting',
    description: 'Standard reports and analytics',
    category: 'business',
    dependencies: ['user_management'],
    isCore: false,
    pricing: {
      tier: 'basic',
      monthlyPrice: 15,
      annualPrice: 150
    }
  },

  // Recruitment modules
  'ats_core': {
    id: 'ats_core',
    name: 'ATS Core',
    description: 'Applicant Tracking System',
    category: 'recruitment',
    dependencies: ['companies', 'people_contacts'],
    isCore: false,
    pricing: {
      tier: 'professional',
      monthlyPrice: 89,
      annualPrice: 890
    }
  },

  // Analytics modules
  'bi_dashboard': {
    id: 'bi_dashboard',
    name: 'BI Dashboard',
    description: 'Business Intelligence Dashboard',
    category: 'analytics',
    dependencies: ['basic_reporting'],
    route: '/superadmin/analytics',
    isCore: false,
    pricing: {
      tier: 'professional',
      monthlyPrice: 49,
      annualPrice: 490
    }
  },
  'advanced_analytics': {
    id: 'advanced_analytics',
    name: 'Advanced Analytics',
    description: 'Advanced analytics and insights',
    category: 'analytics',
    dependencies: ['bi_dashboard'],
    route: '/superadmin/advanced-analytics',
    isCore: false,
    pricing: {
      tier: 'enterprise',
      monthlyPrice: 149,
      annualPrice: 1490
    }
  },

  // AI modules
  'ai_orchestration': {
    id: 'ai_orchestration',
    name: 'AI Orchestration',
    description: 'AI agent management and orchestration',
    category: 'ai',
    dependencies: ['user_management'],
    route: '/superadmin/ai-orchestration',
    isCore: false,
    pricing: {
      tier: 'enterprise',
      monthlyPrice: 199,
      annualPrice: 1990
    }
  },
  'ai_analytics': {
    id: 'ai_analytics',
    name: 'AI Analytics',
    description: 'AI-powered analytics and insights',
    category: 'ai',
    dependencies: ['ai_orchestration', 'advanced_analytics'],
    route: '/superadmin/ai-analytics',
    isCore: false,
    pricing: {
      tier: 'enterprise',
      monthlyPrice: 299,
      annualPrice: 2990
    }
  },

  // Integration modules
  'documentation': {
    id: 'documentation',
    name: 'Documentation',
    description: 'Documentation management system',
    category: 'integration',
    dependencies: ['user_management'],
    route: '/superadmin/documentation',
    isCore: false,
    pricing: {
      tier: 'basic',
      monthlyPrice: 9,
      annualPrice: 90
    }
  }
};

export class ModuleRegistry {
  static getModule(moduleId: string): ModuleDefinition | undefined {
    return MODULE_REGISTRY[moduleId];
  }

  static getAllModules(): ModuleDefinition[] {
    return Object.values(MODULE_REGISTRY);
  }

  static getCoreModules(): ModuleDefinition[] {
    return this.getAllModules().filter(module => module.isCore);
  }

  static getSubscriptionModules(): ModuleDefinition[] {
    return this.getAllModules().filter(module => !module.isCore);
  }

  static getModulesByCategory(category: ModuleDefinition['category']): ModuleDefinition[] {
    return this.getAllModules().filter(module => module.category === category);
  }

  static validateDependencies(moduleId: string, availableModules: string[]): boolean {
    const module = this.getModule(moduleId);
    if (!module) return false;

    return module.dependencies.every(dep => availableModules.includes(dep));
  }

  static getModuleDependencyTree(moduleId: string): string[] {
    const module = this.getModule(moduleId);
    if (!module) return [];

    const dependencies: string[] = [];
    const visited = new Set<string>();

    const collectDependencies = (id: string) => {
      if (visited.has(id)) return;
      visited.add(id);

      const mod = this.getModule(id);
      if (!mod) return;

      mod.dependencies.forEach(dep => {
        collectDependencies(dep);
        dependencies.push(dep);
      });
    };

    collectDependencies(moduleId);
    return [...new Set(dependencies)]; // Remove duplicates
  }
}
