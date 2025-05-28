
import React from 'react';
import { useTenantAdminNavigation } from '@/hooks/useTenantAdminNavigation';
import SortableNavigation from './SortableNavigation';

const TenantAdminNav = () => {
  const { navItems, updateNavOrder } = useTenantAdminNavigation();

  return <SortableNavigation items={navItems} onReorder={updateNavOrder} />;
};

export default TenantAdminNav;
