
import React from 'react';
import { useTenantAdminNavigation } from '@/hooks/useTenantAdminNavigation';
import SortableNavigation from './SortableNavigation';
import { NavItem } from '@/types/navigation';

const TenantAdminNav = () => {
  const { items, updateOrder, updateItemLabel, resetToDefaults } = useTenantAdminNavigation();

  if (!items || items.length === 0) {
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

  // Convert NavItem[] to string[] for the updateOrder function
  const handleReorder = (newItems: typeof items) => {
    const newOrder = newItems.map(item => item.id);
    updateOrder(newOrder);
  };

  return (
    <SortableNavigation 
      items={items} 
      onReorder={handleReorder}
      onRename={updateItemLabel}
      onResetLabel={resetToDefaults}
    />
  );
};

export default TenantAdminNav;
