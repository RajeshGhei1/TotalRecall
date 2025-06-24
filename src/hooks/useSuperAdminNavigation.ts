
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
  Code
} from 'lucide-react';
import { useNavigationPreferences, NavItem } from './useNavigationPreferences';

export const useSuperAdminNavigation = () => {
  // Define all super admin navigation items - always accessible regardless of subscriptions
  const allNavItems = useMemo((): NavItem[] => [
    // Core administrative functions - always available
    { 
      id: 'dashboard',
      label: 'Dashboard', 
      icon: LayoutDashboard, 
      href: '/superadmin/dashboard'
    },
    { 
      id: 'tenants',
      label: 'Tenants', 
      icon: Store, 
      href: '/superadmin/tenants'
    },
    { 
      id: 'users',
      label: 'Tenant Users', 
      icon: Users, 
      href: '/superadmin/users'
    },
    { 
      id: 'subscription-plans',
      label: 'Subscription Plans', 
      icon: Package, 
      href: '/superadmin/subscription-plans'
    },
    { 
      id: 'module-development',
      label: 'Module Development', 
      icon: Code, 
      href: '/superadmin/module-development'
    },
    { 
      id: 'security-dashboard',
      label: 'Security Dashboard', 
      icon: Shield, 
      href: '/superadmin/security-dashboard'
    },
    { 
      id: 'audit-logs',
      label: 'Audit Logs', 
      icon: Shield, 
      href: '/superadmin/audit-logs'
    },
    { 
      id: 'global-settings',
      label: 'Global Settings', 
      icon: Cog, 
      href: '/superadmin/global-settings'
    },
    { 
      id: 'settings',
      label: 'System Settings', 
      icon: Settings, 
      href: '/superadmin/settings'
    },
    // Business intelligence and analytics - always available for super admins
    { 
      id: 'analytics',
      label: 'BI Dashboard', 
      icon: BarChart2, 
      href: '/superadmin/analytics'
    },
    { 
      id: 'advanced-analytics',
      label: 'Advanced Analytics', 
      icon: BarChart3, 
      href: '/superadmin/advanced-analytics'
    },
    // Data management - always available for super admins
    { 
      id: 'companies',
      label: 'Companies', 
      icon: Building2, 
      href: '/superadmin/companies'
    },
    { 
      id: 'people',
      label: 'Business Contacts', 
      icon: Users2, 
      href: '/superadmin/people'
    },
    // AI and automation - always available for super admins
    { 
      id: 'ai-orchestration',
      label: 'AI Orchestration', 
      icon: Brain, 
      href: '/superadmin/ai-orchestration'
    },
    { 
      id: 'ai-analytics',
      label: 'AI Analytics', 
      icon: Zap, 
      href: '/superadmin/ai-analytics'
    },
    // Monitoring and documentation - always available for super admins
    { 
      id: 'user-activity',
      label: 'User Activity', 
      icon: Activity, 
      href: '/superadmin/user-activity'
    },
    { 
      id: 'documentation',
      label: 'Documentation', 
      icon: BookOpen, 
      href: '/superadmin/documentation'
    },
  ], []);

  console.log('Super Admin Navigation: All items always accessible', allNavItems.length);
  
  return useNavigationPreferences('super_admin', allNavItems);
};
