
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
  FileText
} from 'lucide-react';
import { useNavigationPreferences, NavItem } from './useNavigationPreferences';

const defaultNavItems: NavItem[] = [
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
    label: 'Users', 
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
    label: 'People', 
    icon: Users2, 
    href: '/superadmin/people'
  },
  { 
    id: 'form-builder',
    label: 'Form Builder', 
    icon: FileText, 
    href: '/superadmin/form-builder'
  },
  { 
    id: 'subscription-plans',
    label: 'Subscription Plans', 
    icon: Package, 
    href: '/superadmin/subscription-plans'
  },
  { 
    id: 'revenue',
    label: 'Revenue', 
    icon: CircleDollarSign, 
    href: '/superadmin/revenue'
  },
  {
    id: 'analytics',
    label: 'Analytics', 
    icon: PieChart, 
    href: '/superadmin/analytics'
  },
  { 
    id: 'settings',
    label: 'Settings', 
    icon: Settings, 
    href: '/superadmin/settings'
  },
];

export const useSuperAdminNavigation = () => {
  return useNavigationPreferences('super_admin', defaultNavItems);
};
