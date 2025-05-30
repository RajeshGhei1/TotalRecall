
import React from 'react';
import { useTenantAdminNavigation } from '@/hooks/useTenantAdminNavigation';
import SortableNavigation from './SortableNavigation';

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

  return (
    <SortableNavigation 
      items={navigationItems} 
      onReorder={() => {}} // TODO: Implement reorder functionality
      onRename={() => {}} // TODO: Implement rename functionality
      onResetLabel={() => {}} // TODO: Implement reset functionality
    />
  );
};

export default TenantAdminNav;
