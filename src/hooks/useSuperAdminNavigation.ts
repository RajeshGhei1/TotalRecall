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
  Monitor
} from 'lucide-react';
import { useNavigationPreferences, NavItem } from './useNavigationPreferences';

export const useSuperAdminNavigation = () => {
  // Define core super admin navigation items - only administrative functions
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
      id: 'documentation',
      label: 'Documentation', 
      icon: BookOpen, 
      href: '/superadmin/documentation'
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
      id: 'user-activity',
      label: 'User Activity', 
      icon: Monitor, 
      href: '/superadmin/user-activity'
    },
    { 
      id: 'global-settings',
      label: 'Global Settings', 
      icon: Cog, 
      href: '/superadmin/global-settings'
    },
    { 
      id: 'settings',
      label: 'System Settings • Module Management', 
      icon: Settings, 
      href: '/superadmin/settings'
    },
    // Modules parent item - expands to show all system modules
    { 
      id: 'modules',
      label: 'Modules', 
      icon: Blocks, 
      href: '#modules'
    },
  ], []);

  console.log('Super Admin Navigation: Core admin items only', allNavItems.length);
  
  return useNavigationPreferences('super_admin', allNavItems);
};
