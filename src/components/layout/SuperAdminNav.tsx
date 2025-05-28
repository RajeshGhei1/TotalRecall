
import React from 'react';
import { useSuperAdminNavigation } from '@/hooks/useSuperAdminNavigation';
import SortableNavigation from './SortableNavigation';

const SuperAdminNav = () => {
  const { navItems, updateNavOrder } = useSuperAdminNavigation();

  return <SortableNavigation items={navItems} onReorder={updateNavOrder} />;
};

export default SuperAdminNav;
