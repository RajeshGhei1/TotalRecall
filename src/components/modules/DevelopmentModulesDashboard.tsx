
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDevModules } from '@/hooks/useDevModules';
import { LoadedModule } from '@/types/modules';
import { SystemModule } from '@/hooks/useSystemModules';
import ModuleSettingsDialog from '@/components/superadmin/settings/modules/ModuleSettingsDialog';
import DevelopmentModulesDashboardHeader from './dashboard/DevelopmentModulesDashboardHeader';
import ModuleCard from './dashboard/ModuleCard';
import ModulePreview from './dashboard/ModulePreview';
import ModuleLoadingState from './dashboard/ModuleLoadingState';

type ViewMode = 'grid' | 'list';

const DevelopmentModulesDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { loadedModules, isLoading, refreshModules } = useDevModules();
  const [previewingModule, setPreviewingModule] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [selectedModuleForSettings, setSelectedModuleForSettings] = useState<SystemModule | null>(null);

  const handlePreviewModule = (moduleId: string) => {
    setPreviewingModule(moduleId);
  };

  const handleClosePreview = () => {
    setPreviewingModule(null);
  };

  const handleEditModuleCode = (moduleId: string, moduleName: string) => {
    navigate('/superadmin/module-development', { 
      state: { action: 'edit', moduleId: moduleId, moduleName: moduleName } 
    });
  };

  const handleOpenSettings = (module: LoadedModule) => {
    // Convert LoadedModule to SystemModule format for the settings dialog
    const systemModule: SystemModule = {
      id: module.manifest.id,
      name: module.manifest.name,
      category: module.manifest.category as any,
      description: module.manifest.description,
      version: module.manifest.version,
      is_active: module.status === 'loaded',
      dependencies: module.manifest.dependencies,
      default_limits: {},
      created_at: module.loadedAt.toISOString(),
      updated_at: module.loadedAt.toISOString()
    };
    
    setSelectedModuleForSettings(systemModule);
    setSettingsDialogOpen(true);
  };

  const handleCloseSettings = () => {
    setSettingsDialogOpen(false);
    setSelectedModuleForSettings(null);
  };

  const handlePromotionSuccess = () => {
    // Refresh modules after successful promotion
    refreshModules();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <DevelopmentModulesDashboardHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onRefreshModules={refreshModules}
      />

      {/* Preview Section */}
      {previewingModule && (
        <ModulePreview
          moduleId={previewingModule}
          onClose={handleClosePreview}
        />
      )}

      {/* Loading State */}
      {isLoading && <ModuleLoadingState />}

      {/* Module List */}
      {!isLoading && !previewingModule && (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {loadedModules.map((module) => (
            <ModuleCard
              key={module.manifest.id}
              module={module}
              viewMode={viewMode}
              onPreview={handlePreviewModule}
              onEditCode={handleEditModuleCode}
              onOpenSettings={handleOpenSettings}
              onPromotionSuccess={handlePromotionSuccess}
            />
          ))}
        </div>
      )}

      {/* Module Settings Dialog */}
      {selectedModuleForSettings && (
        <ModuleSettingsDialog
          open={settingsDialogOpen}
          onOpenChange={setSettingsDialogOpen}
          module={selectedModuleForSettings}
        />
      )}
    </div>
  );
};

export default DevelopmentModulesDashboard;
