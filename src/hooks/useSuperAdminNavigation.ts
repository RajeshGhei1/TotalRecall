
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

const defaultNavItems: NavItem[] = [
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
  { 
    id: 'documentation',
    label: 'Documentation', 
    icon: BookOpen, 
    href: '/superadmin/documentation'
  },
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
    icon: Activity, 
    href: '/superadmin/user-activity'
  },
  { 
    id: 'subscription-plans',
    label: 'Subscription Plans', 
    icon: Package, 
    href: '/superadmin/subscription-plans'
  },
  { 
    id: 'global-settings',
    label: 'Global Settings', 
    icon: Cog, 
    href: '/superadmin/global-settings'
  },
  { 
    id: 'settings',
    label: 'Tenant Settings', 
    icon: Settings, 
    href: '/superadmin/settings'
  },
];

export const useSuperAdminNavigation = () => {
  return useNavigationPreferences('super_admin', defaultNavItems);
};
