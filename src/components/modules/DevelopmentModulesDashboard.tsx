
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
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {loadedModules.map((module) => (
            <Card key={module.manifest.id} className={viewMode === 'list' ? 'hover:shadow-lg transition-shadow duration-200' : ''}>
              {viewMode === 'list' ? (
                <div className="flex items-center p-6">
                  {/* Module Preview */}
                  <div className="w-24 h-24 flex-shrink-0 mr-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center">
                      <ModuleRenderer moduleId={module.manifest.id} showError={false} />
                    </div>
                  </div>
                  
                  {/* Module Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {module.manifest.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            {module.status === 'error' && (
                              <div className="flex items-center text-red-600">
                                <AlertTriangle className="h-4 w-4 mr-1" />
                                <span className="text-xs font-medium">Error</span>
                              </div>
                            )}
                            {module.status === 'loaded' && (
                              <div className="flex items-center text-green-600">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                <span className="text-xs font-medium">Active</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="secondary" className="text-xs">
                            {module.manifest.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            v{module.manifest.version || '1.0.0'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {module.manifest.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePreviewModule(module.manifest.id)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleEditModuleCode(module.manifest.id, module.manifest.name)}
                        className="flex items-center gap-2"
                      >
                        <Code className="h-4 w-4" />
                        Edit Code
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleOpenSettings(module)}
                        className="flex items-center gap-2"
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
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
                  <CardContent>
                    <div className="mb-4">
                      <ModuleRenderer moduleId={module.manifest.id} showError={false} />
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{module.manifest.description}</p>
                    <div className="flex items-center gap-2">
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
                </>
              )}
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
