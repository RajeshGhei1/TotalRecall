
import React from 'react';
import { useTenantAdminNavigation } from '@/hooks/useTenantAdminNavigation';
import SortableNavigation from './SortableNavigation';
import { NavItem } from '@/types/navigation';

const TenantAdminNav = () => {
  const navigationItems = useTenantAdminNavigation();

  if (!navigationItems || navigationItems.length === 0) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  // Transform NavigationItem[] to NavItem[]
  const navItems: NavItem[] = navigationItems.map(item => ({
    id: item.id,
    label: item.title,
    icon: item.icon,
    href: item.href
  }));

  return (
    <SortableNavigation 
      items={navItems} 
      onReorder={() => {}} // TODO: Implement reorder functionality
      onRename={() => {}} // TODO: Implement rename functionality
      onResetLabel={() => {}} // TODO: Implement reset functionality
    />
  );
};

export default TenantAdminNav;
