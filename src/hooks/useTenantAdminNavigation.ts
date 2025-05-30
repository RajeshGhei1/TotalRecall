
import { NavigationItem } from '@/components/layout/TenantAdminNav';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  UserCheck, 
  Briefcase, 
  Settings,
  Brain
} from 'lucide-react';

export const useTenantAdminNavigation = (): NavigationItem[] => {
  return [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: LayoutDashboard,
      href: '/tenant-admin/dashboard',
      badge: null
    },
    {
      id: 'companies',
      title: 'Companies',
      icon: Building2,
      href: '/tenant-admin/companies',
      badge: null
    },
    {
      id: 'contacts',
      title: 'Contacts',
      icon: Users,
      href: '/tenant-admin/contacts',
      badge: null
    },
    {
      id: 'talent',
      title: 'Talent',
      icon: UserCheck,
      href: '/tenant-admin/talent',
      badge: null
    },
    {
      id: 'smart-talent-analytics',
      title: 'Smart Talent Analytics',
      icon: Brain,
      href: '/tenant-admin/smart-talent-analytics',
      badge: 'AI',
      moduleName: 'smart_talent_analytics'
    },
    {
      id: 'jobs',
      title: 'Jobs',
      icon: Briefcase,
      href: '/tenant-admin/jobs',
      badge: null
    },
    {
      id: 'users',
      title: 'Users',
      icon: Users,
      href: '/tenant-admin/users',
      badge: null
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: Settings,
      href: '/tenant-admin/settings',
      badge: null
    }
  ];
};
