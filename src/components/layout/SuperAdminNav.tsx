
import React from 'react';
import { useSuperAdminNavigation } from '@/hooks/useSuperAdminNavigation';
import SortableNavigation from './SortableNavigation';

const SuperAdminNav = () => {
  const { items, updateOrder, updateItemLabel, resetToDefaults } = useSuperAdminNavigation();

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

export default SuperAdminNav;
