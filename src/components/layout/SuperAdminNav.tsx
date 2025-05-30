
import React from 'react';
import { useSuperAdminNavigation } from '@/hooks/useSuperAdminNavigation';
import SortableNavigation from './SortableNavigation';
import { ErrorDisplay } from '@/components/ui/error-display';

const SuperAdminNav = () => {
  const { items, updateOrder, updateItemLabel, resetToDefaults } = useSuperAdminNavigation();

  return (
    <SortableNavigation 
      items={items} 
      onReorder={updateOrder}
      onRename={updateItemLabel}
      onResetLabel={resetToDefaults}
    />
  );
};

export default SuperAdminNav;
