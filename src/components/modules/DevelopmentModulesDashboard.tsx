
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Blocks, 
  Play, 
  Settings, 
  TestTube,
  ArrowLeft,
  Eye,
  Code,
  RefreshCw,
  Grid3X3,
  List
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useModuleLoader } from '@/hooks/useModuleLoader';
import ModuleRenderer from './ModuleRenderer';
import { ModuleContext } from '@/types/modules';

type ViewMode = 'grid' | 'list';

const DevelopmentModulesDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { loadedModules, isLoading, refreshModules } = useModuleLoader();
  const [previewingModule, setPreviewingModule] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const handlePreview = (moduleId: string, moduleName: string) => {
    console.log(`Previewing module: ${moduleId} (${moduleName})`);
    setPreviewingModule(moduleId);
  };

  const handleTest = (moduleId: string, moduleName: string) => {
    navigate('/superadmin/module-testing', {
      state: { moduleId, moduleName }
    });
  };

  const handleEdit = (moduleId: string, moduleName: string) => {
    navigate('/superadmin/module-development', {
      state: { action: 'edit', moduleId, moduleName }
    });
  };

  const handleBackToList = () => {
    setPreviewingModule(null);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'business': 'bg-blue-50 border-blue-200 text-blue-700',
      'integration': 'bg-green-50 border-green-200 text-green-700',
      'analytics': 'bg-purple-50 border-purple-200 text-purple-700',
      'communication': 'bg-orange-50 border-orange-200 text-orange-700',
    };
    return colors[category] || 'bg-gray-50 border-gray-200 text-gray-700';
  };

  // Test context for module preview
  const createTestContext = (moduleId: string): ModuleContext => ({
    moduleId,
    tenantId: 'dev-tenant',
    userId: 'dev-user',
    permissions: ['read', 'write', 'admin'],
    config: {
      environment: 'development',
      debugMode: true
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading development modules...</p>
        </div>
      </div>
    );
  }

  // Show module preview if one is selected
  if (previewingModule) {
    const module = loadedModules.find(m => m.manifest.id === previewingModule);
    if (!module) {
      setPreviewingModule(null);
      return null;
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBackToList}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Modules
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Module Preview: {module.manifest.name}</h2>
            <p className="text-gray-600">Live preview of the module component</p>
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Module Component Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ModuleRenderer
                moduleId={previewingModule}
                context={createTestContext(previewingModule)}
                props={{}}
                showStatus={true}
                showError={true}
                containerClassName="border rounded-lg p-6 bg-gray-50"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Module Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Module ID:</span>
                  <p className="text-gray-600">{module.manifest.id}</p>
                </div>
                <div>
                  <span className="font-medium">Version:</span>
                  <p className="text-gray-600">{module.manifest.version}</p>
                </div>
                <div>
                  <span className="font-medium">Category:</span>
                  <p className="text-gray-600 capitalize">{module.manifest.category}</p>
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <Badge variant="secondary">{module.status}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Development Modules</h2>
          <p className="text-gray-600 mt-1">
            All modules in the system - both implemented and requiring development
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={refreshModules}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loadedModules.map((module) => {
            const isImplemented = module.status === 'loaded';
            
            return (
              <Card key={module.manifest.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Blocks className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold">{module.manifest.name}</h3>
                      </div>
                      <p className="text-sm text-gray-500">v{module.manifest.version}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge 
                        variant="outline" 
                        className={getCategoryColor(module.manifest.category)}
                      >
                        {module.manifest.category}
                      </Badge>
                      <Badge 
                        variant={isImplemented ? "default" : "secondary"}
                        className={isImplemented ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}
                      >
                        {isImplemented ? "Implemented" : "Needs Dev"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    {module.manifest.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>By {module.manifest.author}</span>
                    <span>Status: {module.status}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handlePreview(module.manifest.id, module.manifest.name)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleTest(module.manifest.id, module.manifest.name)}
                    >
                      <TestTube className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEdit(module.manifest.id, module.manifest.name)}
                    >
                      <Code className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {loadedModules.map((module) => {
            const isImplemented = module.status === 'loaded';
            
            return (
              <Card key={module.manifest.id} className="group hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center gap-2">
                        <Blocks className="h-5 w-5 text-blue-600" />
                        <div>
                          <h3 className="font-semibold">{module.manifest.name}</h3>
                          <p className="text-sm text-gray-500">v{module.manifest.version}</p>
                        </div>
                      </div>
                      
                      <div className="flex-1 px-4">
                        <p className="text-sm text-gray-600 line-clamp-1">
                          {module.manifest.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={getCategoryColor(module.manifest.category)}
                        >
                          {module.manifest.category}
                        </Badge>
                        <Badge 
                          variant={isImplemented ? "default" : "secondary"}
                          className={isImplemented ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}
                        >
                          {isImplemented ? "Implemented" : "Needs Dev"}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handlePreview(module.manifest.id, module.manifest.name)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleTest(module.manifest.id, module.manifest.name)}
                      >
                        <TestTube className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEdit(module.manifest.id, module.manifest.name)}
                      >
                        <Code className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {loadedModules.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <Blocks className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No development modules found</h3>
          <p className="text-gray-600">
            No modules found in the database. Check your database connection.
          </p>
        </div>
      )}
    </div>
  );
};

export default DevelopmentModulesDashboard;
