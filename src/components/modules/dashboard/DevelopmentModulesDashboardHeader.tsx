
import React from 'react';
import { Button } from '@/components/ui/button';
import { Grid, List, RefreshCw } from 'lucide-react';

type ViewMode = 'grid' | 'list';

interface DevelopmentModulesDashboardHeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onRefreshModules: () => void;
}

const DevelopmentModulesDashboardHeader: React.FC<DevelopmentModulesDashboardHeaderProps> = ({
  viewMode,
  onViewModeChange,
  onRefreshModules
}) => {
  return (
    <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Development Modules</h2>
        <p className="text-gray-600">
          Manage, test, and deploy your modular components
        </p>
      </div>
      <div className="flex items-center gap-3">
        {/* View Mode Toggle */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1 shadow-inner">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
            className={`h-8 px-3 ${
              viewMode === 'grid' 
                ? 'bg-white shadow-sm' 
                : 'hover:bg-gray-200'
            } transition-all`}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('list')}
            className={`h-8 px-3 ${
              viewMode === 'list' 
                ? 'bg-white shadow-sm' 
                : 'hover:bg-gray-200'
            } transition-all`}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Refresh Button */}
        <Button 
          onClick={onRefreshModules} 
          variant="outline"
          className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Modules
        </Button>
      </div>
    </div>
  );
};

export default DevelopmentModulesDashboardHeader;
