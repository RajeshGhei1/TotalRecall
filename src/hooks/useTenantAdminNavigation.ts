
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
  customLabel?: string;
  icon: React.ComponentType<{ size?: string | number }>;
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
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        
        // Handle both old format (just IDs) and new format (full items with custom labels)
        if (Array.isArray(parsedData) && typeof parsedData[0] === 'string') {
          // Old format - just order IDs
          const orderedItems = parsedData
            .map((id: string) => defaultNavItems.find(item => item.id === id))
            .filter(Boolean);
          
          const missingItems = defaultNavItems.filter(
            item => !parsedData.includes(item.id)
          );
          
          setNavItems([...orderedItems, ...missingItems]);
        } else if (Array.isArray(parsedData) && parsedData[0]?.id) {
          // New format - items with custom labels
          const orderedItems = parsedData.map((savedItem: any) => {
            const defaultItem = defaultNavItems.find(item => item.id === savedItem.id);
            return defaultItem ? { ...defaultItem, customLabel: savedItem.customLabel } : null;
          }).filter(Boolean);
          
          const missingItems = defaultNavItems.filter(
            item => !parsedData.find((saved: any) => saved.id === item.id)
          );
          
          setNavItems([...orderedItems, ...missingItems]);
        }
      } catch (error) {
        console.error('Failed to parse saved navigation data:', error);
      }
    }
  }, []);

  const updateNavOrder = (newItems: NavItem[]) => {
    setNavItems(newItems);
    saveNavData(newItems);
  };

  const updateNavLabel = (id: string, newLabel: string) => {
    const updatedItems = navItems.map(item => 
      item.id === id ? { ...item, customLabel: newLabel } : item
    );
    setNavItems(updatedItems);
    saveNavData(updatedItems);
  };

  const resetNavLabel = (id: string) => {
    const updatedItems = navItems.map(item => 
      item.id === id ? { ...item, customLabel: undefined } : item
    );
    setNavItems(updatedItems);
    saveNavData(updatedItems);
  };

  const resetToDefault = () => {
    setNavItems(defaultNavItems);
    localStorage.removeItem(STORAGE_KEY);
  };

  const saveNavData = (items: NavItem[]) => {
    const dataToSave = items.map(item => ({
      id: item.id,
      customLabel: item.customLabel
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  };

  return {
    navItems,
    updateNavOrder,
    updateNavLabel,
    resetNavLabel,
    resetToDefault
  };
};
