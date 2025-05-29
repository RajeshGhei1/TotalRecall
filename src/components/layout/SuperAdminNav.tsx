
import React from 'react';
import { useSuperAdminNavigation } from '@/hooks/useSuperAdminNavigation';
import SortableNavigation from './SortableNavigation';

const SuperAdminNav = () => {
  const { navItems, updateNavOrder, updateNavLabel, resetNavLabel, isLoading } = useSuperAdminNavigation();

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

export default SuperAdminNav;
