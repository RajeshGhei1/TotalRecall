
import React from 'react';
import { useSuperAdminNavigation } from '@/hooks/useSuperAdminNavigation';
import SortableNavigation from './SortableNavigation';

const SuperAdminNav = () => {
  const { navItems, updateNavOrder, updateNavLabel, resetNavLabel } = useSuperAdminNavigation();

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
