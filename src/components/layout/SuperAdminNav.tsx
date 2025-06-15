
import React from 'react';
import { useSuperAdminNavigation } from '@/hooks/useSuperAdminNavigation';
import SortableNavigation from './SortableNavigation';

const SuperAdminNav = () => {
  const { items, reorderItems } = useSuperAdminNavigation();

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

export default SuperAdminNav;
