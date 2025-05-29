
import { 
  BarChart2,
  Building2, 
  Briefcase, 
  Contact, 
  LayoutDashboard, 
  Settings, 
  Users,
  Users2
} from 'lucide-react';
import { useNavigationPreferences, NavItem } from './useNavigationPreferences';

const defaultNavItems: NavItem[] = [
  { 
    id: 'dashboard',
    label: 'Dashboard', 
    icon: LayoutDashboard, 
    href: '/tenant-admin/dashboard'
  },
  { 
    id: 'users',
    label: 'Users', 
    icon: Users, 
    href: '/tenant-admin/users'
  },
  { 
    id: 'talent',
    label: 'Talent', 
    icon: Users2, 
    href: '/tenant-admin/talent'
  },
  { 
    id: 'companies',
    label: 'Companies', 
    icon: Building2, 
    href: '/tenant-admin/companies'
  },
  { 
    id: 'contacts',
    label: 'Contacts', 
    icon: Contact, 
    href: '/tenant-admin/contacts'
  },
  { 
    id: 'jobs',
    label: 'Jobs', 
    icon: Briefcase, 
    href: '/tenant-admin/jobs'
  },
  { 
    id: 'settings',
    label: 'Settings', 
    icon: Settings, 
    href: '/tenant-admin/settings'
  },
];

export const useTenantAdminNavigation = () => {
  return useNavigationPreferences('tenant_admin', defaultNavItems);
};
