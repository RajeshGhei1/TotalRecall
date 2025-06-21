
import { useState, useEffect } from 'react';
import { 
  Users, 
  Building2, 
  Settings, 
  BarChart3, 
  Briefcase, 
  Database,
  Code,
  FileText,
  Zap
} from 'lucide-react';
import { useNavigationPreferences } from './useNavigationPreferences';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  description?: string;
  badge?: string;
  children?: NavItem[];
}

const DEFAULT_NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: BarChart3,
    href: '/superadmin/dashboard',
    description: 'System overview and analytics'
  },
  {
    id: 'tenant-management',
    label: 'Tenant Management',
    icon: Building2,
    href: '/superadmin/tenant-management',
    description: 'Manage client organizations'
  },
  {
    id: 'user-management',
    label: 'User Management',
    icon: Users,
    href: '/superadmin/user-management',
    description: 'Manage system users and permissions'
  },
  {
    id: 'job-management',
    label: 'Job Management',
    icon: Briefcase,
    href: '/superadmin/job-management',
    description: 'Manage job postings and applications'
  },
  {
    id: 'database-management',
    label: 'Database Management',
    icon: Database,
    href: '/superadmin/database-management',
    description: 'Manage system databases and data'
  },
  {
    id: 'module-development',
    label: 'Module Development',
    icon: Code,
    href: '/superadmin/module-development',
    description: 'Development environment for system modules',
    badge: 'Dev'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    href: '/superadmin/analytics',
    description: 'System analytics and insights'
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: FileText,
    href: '/superadmin/reports',
    description: 'Generate and manage reports'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    href: '/superadmin/settings',
    description: 'System configuration and preferences'
  }
];

export const useSuperAdminNavigation = () => {
  const { preferences, updateOrder } = useNavigationPreferences();
  const [items, setItems] = useState<NavItem[]>(DEFAULT_NAV_ITEMS);

  useEffect(() => {
    if (preferences.itemOrder && preferences.itemOrder.length > 0) {
      const orderedItems = preferences.itemOrder
        .map(id => DEFAULT_NAV_ITEMS.find(item => item.id === id))
        .filter(Boolean) as NavItem[];
      
      // Add any new items that weren't in the saved order
      const existingIds = new Set(preferences.itemOrder);
      const newItems = DEFAULT_NAV_ITEMS.filter(item => !existingIds.has(item.id));
      
      setItems([...orderedItems, ...newItems]);
    }
  }, [preferences.itemOrder]);

  const reorderItems = (newOrder: string[]) => {
    updateOrder(newOrder);
  };

  return {
    items,
    reorderItems
  };
};
