
import React from 'react';
import { useTenantAdminNavigation } from '@/hooks/useTenantAdminNavigation';
import SortableNavigation from './SortableNavigation';
import { NavItem } from '@/types/navigation';

const TenantAdminNav = () => {
  const { items, reorderItems } = useTenantAdminNavigation();

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
    reorderItems(newOrder);
  };

  // Placeholder functions for rename and reset (not implemented in useNavigationPreferences)
  const handleRename = (id: string, newLabel: string) => {
    console.log('Rename functionality not implemented yet:', id, newLabel);
  };

  const handleResetLabel = (id: string) => {
    console.log('Reset label functionality not implemented yet:', id);
  };

  return (
    <SortableNavigation 
      items={items} 
      onReorder={handleReorder}
      onRename={handleRename}
      onResetLabel={handleResetLabel}
    />
  );
};

export default TenantAdminNav;
