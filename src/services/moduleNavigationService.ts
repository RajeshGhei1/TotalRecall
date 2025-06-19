
// Service to handle navigation to module implementations
export interface ModuleRoute {
  moduleId: string;
  path: string;
  name: string;
  description: string;
  requiresAuth: boolean;
  category: string;
}

class ModuleNavigationService {
  private static instance: ModuleNavigationService;
  private moduleRoutes: Map<string, ModuleRoute> = new Map();

  static getInstance(): ModuleNavigationService {
    if (!ModuleNavigationService.instance) {
      ModuleNavigationService.instance = new ModuleNavigationService();
    }
    return ModuleNavigationService.instance;
  }

  constructor() {
    this.initializeModuleRoutes();
  }

  private initializeModuleRoutes(): void {
    // Define mappings between module names and their actual routes
    const routes: ModuleRoute[] = [
      {
        moduleId: 'company_database',
        path: '/superadmin/companies',
        name: 'Company Database',
        description: 'Manage company records and organizational data',
        requiresAuth: true,
        category: 'core'
      },
      {
        moduleId: 'business_contacts_data_access',
        path: '/superadmin/companies',
        name: 'Business Contacts & Data Access',
        description: 'Access and manage business contact information',
        requiresAuth: true,
        category: 'core'
      },
      {
        moduleId: 'user_management',
        path: '/superadmin/users',
        name: 'User Management',
        description: 'Manage system users and permissions',
        requiresAuth: true,
        category: 'core'
      },
      {
        moduleId: 'ats_core',
        path: '/ats',
        name: 'ATS Core',
        description: 'Core Applicant Tracking System functionality',
        requiresAuth: true,
        category: 'recruitment'
      },
      {
        moduleId: 'talent_database',
        path: '/talent',
        name: 'Talent Database',
        description: 'Comprehensive talent database and analytics',
        requiresAuth: true,
        category: 'recruitment'
      },
      {
        moduleId: 'core_dashboard',
        path: '/dashboard',
        name: 'Core Dashboard',
        description: 'Main system dashboard and overview',
        requiresAuth: true,
        category: 'core'
      },
      {
        moduleId: 'smart_talent_analytics',
        path: '/analytics/talent',
        name: 'Smart Talent Analytics',
        description: 'AI-powered talent analytics and insights',
        requiresAuth: true,
        category: 'analytics'
      },
      {
        moduleId: 'document_management',
        path: '/documents',
        name: 'Document Management',
        description: 'Document storage and management system',
        requiresAuth: true,
        category: 'core'
      },
      {
        moduleId: 'ai_orchestration',
        path: '/ai',
        name: 'AI Orchestration',
        description: 'AI agent management and orchestration',
        requiresAuth: true,
        category: 'ai'
      },
      {
        moduleId: 'custom_field_management',
        path: '/admin/fields',
        name: 'Custom Field Management',
        description: 'Manage custom fields and data structures',
        requiresAuth: true,
        category: 'configuration'
      }
    ];

    routes.forEach(route => {
      this.moduleRoutes.set(route.moduleId, route);
    });
  }

  getModuleRoute(moduleId: string): ModuleRoute | null {
    return this.moduleRoutes.get(moduleId) || null;
  }

  getAllModuleRoutes(): ModuleRoute[] {
    return Array.from(this.moduleRoutes.values());
  }

  getModulesByCategory(category: string): ModuleRoute[] {
    return this.getAllModuleRoutes().filter(route => route.category === category);
  }

  isModuleAccessible(moduleId: string): boolean {
    const route = this.getModuleRoute(moduleId);
    return route !== null;
  }

  getModulePath(moduleId: string): string | null {
    const route = this.getModuleRoute(moduleId);
    return route ? route.path : null;
  }

  navigateToModule(moduleId: string): string | null {
    const path = this.getModulePath(moduleId);
    if (path) {
      // Return the path for navigation
      return path;
    }
    return null;
  }
}

export const moduleNavigationService = ModuleNavigationService.getInstance();
