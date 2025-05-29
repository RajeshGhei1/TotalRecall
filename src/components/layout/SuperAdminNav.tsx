
import React from 'react';
import { useSuperAdminNavigation } from '@/hooks/useSuperAdminNavigation';
import SortableNavigation from './SortableNavigation';
import { ErrorDisplay } from '@/components/ui/error-display';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const SuperAdminNav = () => {
  const { navItems, updateNavOrder, updateNavLabel, resetNavLabel, isLoading, error } = useSuperAdminNavigation();

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <ErrorDisplay
          error={new Error(error)}
          onRetry={() => window.location.reload()}
          title="Navigation Error"
          className="mb-4"
        />
        <SortableNavigation 
          items={navItems} 
          onReorder={updateNavOrder}
          onRename={updateNavLabel}
          onResetLabel={resetNavLabel}
        />
      </div>
    );
  }

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
