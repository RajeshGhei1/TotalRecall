
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Briefcase,
  UserCheck,
  Settings, 
  BarChart3,
  Brain,
  Calendar,
  FileText,
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
    id: 'ats',
    label: 'Applicant Tracking', 
    icon: UserCheck, 
    href: '/tenant-admin/ats'
  },
  { 
    id: 'jobs',
    label: 'Jobs', 
    icon: Briefcase, 
    href: '/tenant-admin/jobs'
  },
  { 
    id: 'talent',
    label: 'Talent Pool', 
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
    icon: Users, 
    href: '/tenant-admin/contacts'
  },
  { 
    id: 'smart-talent-analytics',
    label: 'Smart Talent Analytics', 
    icon: Brain, 
    href: '/tenant-admin/smart-talent-analytics'
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
