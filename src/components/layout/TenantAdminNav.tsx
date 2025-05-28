
import React from 'react';
import { useTenantAdminNavigation } from '@/hooks/useTenantAdminNavigation';
import SortableNavigation from './SortableNavigation';

const TenantAdminNav = () => {
  const { navItems, updateNavOrder, updateNavLabel, resetNavLabel } = useTenantAdminNavigation();

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
