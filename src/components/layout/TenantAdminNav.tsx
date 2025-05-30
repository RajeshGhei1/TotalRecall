
import React from 'react';
import { useTenantAdminNavigation } from '@/hooks/useTenantAdminNavigation';
import SortableNavigation from './SortableNavigation';
import { NavItem } from '@/types/navigation';

const TenantAdminNav = () => {
  const { navItems, isLoading } = useTenantAdminNavigation();

  if (isLoading || !navItems || navItems.length === 0) {
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

  // Transform NavigationItem[] to NavItem[] - use label instead of title
  const transformedNavItems: NavItem[] = navItems.map(item => ({
    id: item.id,
    label: item.label,
    icon: item.icon,
    href: item.href
  }));

  return (
    <SortableNavigation 
      items={transformedNavItems} 
      onReorder={() => {}} // TODO: Implement reorder functionality
      onRename={() => {}} // TODO: Implement rename functionality
      onResetLabel={() => {}} // TODO: Implement reset functionality
    />
  );
};

export default TenantAdminNav;
