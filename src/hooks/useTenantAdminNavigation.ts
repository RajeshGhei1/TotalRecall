
import { useState, useEffect } from 'react';
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

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  href: string;
}

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

const STORAGE_KEY = 'tenant-admin-nav-order';

export const useTenantAdminNavigation = () => {
  const [navItems, setNavItems] = useState<NavItem[]>(defaultNavItems);

  useEffect(() => {
    const savedOrder = localStorage.getItem(STORAGE_KEY);
    if (savedOrder) {
      try {
        const orderIds = JSON.parse(savedOrder);
        const orderedItems = orderIds
          .map((id: string) => defaultNavItems.find(item => item.id === id))
          .filter(Boolean);
        
        // Add any new items that might not be in saved order
        const missingItems = defaultNavItems.filter(
          item => !orderIds.includes(item.id)
        );
        
        setNavItems([...orderedItems, ...missingItems]);
      } catch (error) {
        console.error('Failed to parse saved navigation order:', error);
      }
    }
  }, []);

  const updateNavOrder = (newItems: NavItem[]) => {
    setNavItems(newItems);
    const orderIds = newItems.map(item => item.id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orderIds));
  };

  const resetToDefault = () => {
    setNavItems(defaultNavItems);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    navItems,
    updateNavOrder,
    resetToDefault
  };
};
