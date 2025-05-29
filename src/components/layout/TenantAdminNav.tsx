
import React from 'react';
import { useTenantAdminNavigation } from '@/hooks/useTenantAdminNavigation';
import SortableNavigation from './SortableNavigation';

const TenantAdminNav = () => {
  const { navItems, updateNavOrder, updateNavLabel, resetNavLabel, isLoading } = useTenantAdminNavigation();

  if (isLoading) {
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

  return (
    <SortableNavigation 
      items={navItems} 
      onReorder={updateNavOrder}
      onRename={updateNavLabel}
      onResetLabel={resetNavLabel}
    />
  );
};

export default TenantAdminNav;
