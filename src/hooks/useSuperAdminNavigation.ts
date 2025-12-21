import { useMemo } from 'react';
import { 
  BarChart2,
  Building2, 
  CircleDollarSign, 
  LayoutDashboard, 
  Settings, 
  Store, 
  Users,
  Users2,
  PieChart,
  Package,
  Cog,
  TrendingUp,
  Brain,
  Zap,
  Shield,
  Activity,
  BookOpen,
  BarChart3,
  Code,
  Blocks,
  Monitor,
  CheckCircle,
  Crown,
  Server,
  Database
} from 'lucide-react';
import { useNavigationPreferences, NavItem } from './useNavigationPreferences';

export const useSuperAdminNavigation = () => {
  // Define core super admin navigation items with proper hierarchy
  const allNavItems = useMemo((): NavItem[] => [
    // ==========================================
    // DASHBOARD & OVERVIEW
    // ==========================================
    { 
      id: 'dashboard',
      label: 'Dashboard', 
      icon: LayoutDashboard, 
      href: '/superadmin/dashboard',
      category: 'overview',
      priority: 1
    },
    { 
      id: 'core-dashboard',
      label: 'Core Dashboard', 
      icon: Database, 
      href: '/superadmin/core-dashboard',
      category: 'overview',
      priority: 2
    },
    { 
      id: 'dashboard-widget',
      label: 'Dashboard Widget', 
      icon: BarChart3, 
      href: '/superadmin/dashboard-widget',
      category: 'overview',
      priority: 3
    },
    { 
      id: 'user-activity',
      label: 'User Activity', 
      icon: Monitor, 
      href: '/superadmin/user-activity',
      category: 'overview',
      priority: 4
    },
    
    // ==========================================
    // SUPER ADMIN MODULES (Top Level - Always Visible)
    // ==========================================
    { 
      id: 'system-administration-suite',
      label: 'System Administration Suite', 
      icon: Crown, 
      href: '/superadmin/system-administration-suite',
      category: 'super_admin_modules',
      isSuperAdminModule: true,
      priority: 1
    },
    { 
      id: 'module-registry-deployment',
      label: 'Module Registry & Deployment', 
      icon: Server, 
      href: '/superadmin/module-registry-deployment',
      category: 'super_admin_modules',
      isSuperAdminModule: true,
      priority: 1
    },
    { 
      id: 'enterprise-monitoring-audit',
      label: 'Enterprise Monitoring & Audit', 
      icon: Activity, 
      href: '/superadmin/enterprise-monitoring-audit',
      category: 'super_admin_modules',
      isSuperAdminModule: true,
      priority: 1
    },
    
    // ==========================================
    // TENANT MANAGEMENT
    // ==========================================
    { 
      id: 'tenants',
      label: 'Tenants', 
      icon: Store, 
      href: '/superadmin/tenants',
      category: 'tenant_management',
      priority: 1
    },
    { 
      id: 'users',
      label: 'Tenant Users', 
      icon: Users, 
      href: '/superadmin/users',
      category: 'tenant_management',
      priority: 2
    },
    { 
      id: 'subscription-plans',
      label: 'Subscription Plans', 
      icon: Package, 
      href: '/superadmin/subscription-plans',
      category: 'tenant_management',
      priority: 3
    },
    
    // ==========================================
    // SYSTEM CONFIGURATION
    // ==========================================
    { 
      id: 'feature-management',
      label: 'Feature Management', 
      icon: CheckCircle, 
      href: '/superadmin/feature-management',
      category: 'system_configuration',
      priority: 1
    },
    { 
      id: 'module-development',
      label: 'App Development', 
      icon: Code, 
      href: '/superadmin/module-development',
      category: 'system_configuration',
      priority: 2
    },
    { 
      id: 'global-settings',
      label: 'Global Settings', 
      icon: Cog, 
      href: '/superadmin/global-settings',
      category: 'system_configuration',
      priority: 3
    },
    { 
      id: 'settings',
      label: 'System Settings', 
      icon: Settings, 
      href: '/superadmin/settings',
      category: 'system_configuration',
      priority: 4
    },
    { 
      id: 'cognitive-assistance',
      label: 'Cognitive Assistance', 
      icon: Brain, 
      href: '/superadmin/cognitive-assistance',
      category: 'system_configuration',
      priority: 5
    },
    { 
      id: 'knowledge-synthesis',
      label: 'Knowledge Synthesis', 
      icon: BookOpen, 
      href: '/superadmin/knowledge-synthesis',
      category: 'system_configuration',
      priority: 6
    },
    { 
      id: 'workflow-automation',
      label: 'Workflow Automation', 
      icon: Zap, 
      href: '/superadmin/workflow-automation',
      category: 'system_configuration',
      priority: 7
    },
    
    // ==========================================
    // MONITORING & SECURITY
    // ==========================================
    { 
      id: 'enterprise-monitoring-audit',
      label: 'Enterprise Monitoring & Audit', 
      icon: Monitor, 
      href: '/superadmin/enterprise-monitoring-audit',
      category: 'monitoring_security',
      priority: 1
    },
    { 
      id: 'security-dashboard',
      label: 'Security Dashboard', 
      icon: Shield, 
      href: '/superadmin/security-dashboard',
      category: 'monitoring_security',
      priority: 2
    },
    { 
      id: 'audit-logs',
      label: 'Audit Logs', 
      icon: Shield, 
      href: '/superadmin/audit-logs',
      category: 'monitoring_security',
      priority: 3
    },
    { 
      id: 'documentation',
      label: 'Documentation', 
      icon: BookOpen, 
      href: '/superadmin/documentation',
      category: 'monitoring_security',
      priority: 4
    },
    
    // ==========================================
    // MODULES (Collapsible)
    // ==========================================
    { 
      id: 'modules',
      label: 'Modules', 
      icon: Blocks, 
      href: '#modules',
      category: 'modules',
      priority: 5,
      isCollapsible: true
    },
  ], []);

  console.log('Super Admin Navigation: Updated with proper hierarchy', allNavItems.length);
  
  return useNavigationPreferences('super_admin', allNavItems);
};
