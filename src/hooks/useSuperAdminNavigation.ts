
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
  BarChart3
} from 'lucide-react';
import { useNavigationPreferences, NavItem } from './useNavigationPreferences';
import { ModuleRegistry } from '@/services/moduleRegistry';

// Core Super Admin items (always available)
const coreNavItems: NavItem[] = [
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
];

// Module-based items (subscription controlled)
const moduleNavItems: NavItem[] = [
  { 
    id: 'analytics',
    label: 'BI Dashboard', 
    icon: BarChart2, 
    href: '/superadmin/analytics',
    moduleId: 'bi_dashboard'
  },
  { 
    id: 'advanced-analytics',
    label: 'Advanced Analytics', 
    icon: BarChart3, 
    href: '/superadmin/advanced-analytics',
    moduleId: 'advanced_analytics'
  },
  { 
    id: 'companies',
    label: 'Companies', 
    icon: Building2, 
    href: '/superadmin/companies',
    moduleId: 'companies'
  },
  { 
    id: 'people',
    label: 'Business Contacts', 
    icon: Users2, 
    href: '/superadmin/people',
    moduleId: 'people_contacts'
  },
  { 
    id: 'documentation',
    label: 'Documentation', 
    icon: BookOpen, 
    href: '/superadmin/documentation',
    moduleId: 'documentation'
  },
  { 
    id: 'ai-orchestration',
    label: 'AI Orchestration', 
    icon: Brain, 
    href: '/superadmin/ai-orchestration',
    moduleId: 'ai_orchestration'
  },
  { 
    id: 'ai-analytics',
    label: 'AI Analytics', 
    icon: Zap, 
    href: '/superadmin/ai-analytics',
    moduleId: 'ai_analytics'
  },
  { 
    id: 'user-activity',
    label: 'User Activity', 
    icon: Activity, 
    href: '/superadmin/user-activity',
    moduleId: 'advanced_analytics'
  },
];

export const useSuperAdminNavigation = () => {
  // TODO: Get user's accessible modules from subscription/permissions
  const accessibleModules = ModuleRegistry.getSubscriptionModules().map(m => m.id);
  
  // Filter module items based on access
  const filteredModuleItems = moduleNavItems.filter(item => 
    !item.moduleId || accessibleModules.includes(item.moduleId)
  );

  const allNavItems = [...coreNavItems, ...filteredModuleItems];
  
  return useNavigationPreferences('super_admin', allNavItems);
};
