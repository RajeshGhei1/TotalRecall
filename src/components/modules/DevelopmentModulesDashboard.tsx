
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Grid, 
  List,
  Play, 
  Eye, 
  Settings, 
  Code, 
  Package,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  ExternalLink,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useModuleLoader } from '@/hooks/useModuleLoader';
import ModuleRenderer from './ModuleRenderer';
import ModuleSettingsDialog from '@/components/superadmin/settings/modules/ModuleSettingsDialog';
import { ModuleContext } from '@/types/modules';

type ViewMode = 'grid' | 'list';

const DevelopmentModulesDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { loadedModules, isLoading, refreshModules } = useModuleLoader();
  const [previewingModule, setPreviewingModule] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [selectedModuleForSettings, setSelectedModuleForSettings] = useState<any>(null);

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

  const handleOpenSettings = (module: any) => {
    setSelectedModuleForSettings(module);
    setSettingsDialogOpen(true);
  };

  const handleCloseSettings = () => {
    setSettingsDialogOpen(false);
    setSelectedModuleForSettings(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={refreshModules} variant="outline">
            Refresh Modules
          </Button>
        </div>
      </div>

      {/* Preview Section */}
      {previewingModule && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Module Preview
              <Button variant="ghost" size="sm" onClick={handleClosePreview}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ModuleRenderer moduleId={previewingModule} />
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent>
            <div className="flex items-center justify-center">
              <Zap className="h-6 w-6 animate-spin mr-2" />
              Loading modules...
            </div>
          </CardContent>
        </Card>
      )}

      {/* Module List */}
      {!isLoading && !previewingModule && (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
          {loadedModules.map((module) => (
            <Card key={module.manifest.id} className={viewMode === 'list' ? 'flex flex-row items-center' : ''}>
              {viewMode === 'list' && (
                <div className="w-24 h-24 p-4">
                  <ModuleRenderer moduleId={module.manifest.id} showError={false} />
                </div>
              )}
              <CardContent className={viewMode === 'list' ? 'flex-1' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {module.manifest.name}
                    <div className="flex items-center gap-2">
                      {module.status === 'error' && (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                      {module.status === 'loaded' && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      <Badge variant="secondary">{module.manifest.category}</Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <p className="text-sm text-muted-foreground">{module.manifest.description}</p>
                <div className="mt-4 flex items-center justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePreviewModule(module.manifest.id)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleEditModuleCode(module.manifest.id, module.manifest.name)}
                  >
                    <Code className="h-4 w-4 mr-2" />
                    Edit Code
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleOpenSettings(module)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
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
