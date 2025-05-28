
import { useState, useEffect } from 'react';
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
  Package
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

const STORAGE_KEY = 'superadmin-nav-order';

export const useSuperAdminNavigation = () => {
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
