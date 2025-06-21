
import React from 'react';
import { useSuperAdminNavigation } from '@/hooks/useSuperAdminNavigation';
import SortableNavigation from './SortableNavigation';

const SuperAdminNav = () => {
  const { items, reorderItems } = useSuperAdminNavigation();

  // Convert NavItem[] to the expected format for SortableNavigation
  const convertedItems = items.map(item => ({
    id: item.id,
    label: item.label,
    customLabel: undefined,
    icon: item.icon,
    href: item.href
  }));

  const handleReorder = (newItems: typeof convertedItems) => {
    const newOrder = newItems.map(item => item.id);
    reorderItems(newOrder);
  };

  const handleRename = (id: string, newLabel: string) => {
    console.log('Rename functionality not implemented yet:', id, newLabel);
  };

  const handleResetLabel = (id: string) => {
    console.log('Reset label functionality not implemented yet:', id);
  };

  return (
    <SortableNavigation 
      items={convertedItems} 
      onReorder={handleReorder}
      onRename={handleRename}
      onResetLabel={handleResetLabel}
    />
  );
};

export default SuperAdminNav;
