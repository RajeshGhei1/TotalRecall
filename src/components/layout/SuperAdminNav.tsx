
import React, { useState } from 'react';
import { useSuperAdminNavigation } from '@/hooks/useSuperAdminNavigation';
import SortableNavigation from './SortableNavigation';
import ModuleNavigationItem from './ModuleNavigationItem';

const SuperAdminNav = () => {
  const { items, reorderItems } = useSuperAdminNavigation();
  const [isModulesExpanded, setIsModulesExpanded] = useState(false);

  // Separate modules item from other items
  const coreItems = items.filter(item => item.id !== 'modules');
  const modulesItem = items.find(item => item.id === 'modules');

  // Convert NavItem[] to string[] for the updateOrder function
  const handleReorder = (newItems: typeof coreItems) => {
    // Include the modules item in the reorder operation
    const newOrder = [...newItems.map(item => item.id), 'modules'];
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
    <div className="space-y-1 px-2 w-full">
      {/* Core navigation items */}
      <SortableNavigation 
        items={coreItems} 
        onReorder={handleReorder}
        onRename={handleRename}
        onResetLabel={handleResetLabel}
      />
      
      {/* Modules hierarchical item */}
      {modulesItem && (
        <div className="pt-2">
          <ModuleNavigationItem
            isExpanded={isModulesExpanded}
            onToggle={() => setIsModulesExpanded(!isModulesExpanded)}
          />
        </div>
      )}
    </div>
  );
};

export default SuperAdminNav;
