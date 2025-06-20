
import React from 'react';
import { Button } from '@/components/ui/button';
import { Grid, List } from 'lucide-react';

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
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Development Modules</h2>
        <p className="text-gray-600 mt-1">
          Manage and test your development modules
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center border rounded-lg p-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
        <Button onClick={onRefreshModules} variant="outline">
          Refresh Modules
        </Button>
      </div>
    </div>
  );
};

export default DevelopmentModulesDashboardHeader;
