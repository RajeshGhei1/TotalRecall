
import React, { useState } from 'react';
import { useSuperAdminNavigation } from '@/hooks/useSuperAdminNavigation';
import SortableNavigation from './SortableNavigation';
import ModuleNavigationItem from './ModuleNavigationItem';
import { ChevronDown, ChevronRight } from 'lucide-react';
import './super-admin-nav.css';

const SuperAdminNav = () => {
  const { items, reorderItems } = useSuperAdminNavigation();
  const [isModulesExpanded, setIsModulesExpanded] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    overview: true,
    super_admin_modules: true,
    tenant_management: true,
    system_configuration: true,
    monitoring_security: true
  });

  // Separate modules item from other items
  const coreItems = items.filter(item => item.id !== 'modules');
  const modulesItem = items.find(item => item.id === 'modules');

  // Group items by category for better organization
  const groupedItems = coreItems.reduce((acc, item) => {
    const category = item.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, typeof coreItems>);

  // Convert NavItem[] to string[] for the updateOrder function
  const handleReorder = (newItems: typeof coreItems) => {
    // Include the modules item in the reorder operation
    const newOrder = [...newItems.map(item => item.id), 'modules'];
    reorderItems(newOrder);
  };

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Placeholder functions for rename and reset (not implemented in useNavigationPreferences)
  const handleRename = (id: string, newLabel: string) => {
    console.log('Rename functionality not implemented yet:', id, newLabel);
  };

  const handleResetLabel = (id: string) => {
    console.log('Reset label functionality not implemented yet:', id);
  };

  // Category labels
  const categoryLabels = {
    overview: 'Dashboard & Overview',
    super_admin_modules: 'Super Admin Modules',
    tenant_management: 'Tenant Management',
    system_configuration: 'System Configuration',
    monitoring_security: 'Monitoring & Security',
    other: 'Other'
  };

  return (
    <div className="space-y-1 px-2 w-full">
      {/* Render items grouped by category */}
      {Object.entries(groupedItems).map(([category, categoryItems]) => {
        const isExpanded = expandedCategories[category] ?? true;
        const categoryLabel = categoryLabels[category as keyof typeof categoryLabels] || category;
        
        return (
          <div key={category} className="space-y-1">
            {/* Category header with collapse toggle */}
            {category !== 'other' && (
              <div 
                className={`nav-category-header ${!isExpanded ? 'collapsed' : ''}`}
                onClick={() => toggleCategory(category)}
                style={{ cursor: 'pointer', userSelect: 'none' }}
              >
                <div className="flex items-center justify-between">
                  <span className="nav-category">{categoryLabel}</span>
                  <div className="chevron-icon">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Category items - collapsible */}
            {isExpanded && (
              <div className="space-y-1 nav-category-items">
                {categoryItems.map((item) => (
                  <div
                    key={item.id}
                    className={`nav-item ${item.isSuperAdminModule ? 'super-admin-module' : ''}`}
                    data-priority={item.priority}
                    data-collapsible={item.isCollapsible}
                    data-category={item.category}
                    data-core-module={item.isSuperAdminModule && item.category === 'super_admin_modules'}
                    data-tier={item.isSuperAdminModule ? '0' : (item.priority && item.priority <= 2 ? '1' : '2')}
                  >
                    <SortableNavigation 
                      items={[item]} 
                      onReorder={() => {}} // Individual items don't need reordering
                      onRename={handleRename}
                      onResetLabel={handleResetLabel}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
      
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
