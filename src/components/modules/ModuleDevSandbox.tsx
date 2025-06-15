
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  RefreshCw, 
  Play, 
  Square, 
  Code, 
  Eye, 
  Layers,
  Activity,
  Package,
  Upload,
  Zap,
  TrendingUp
} from 'lucide-react';
import { useModuleLoader } from '@/hooks/useModuleLoader';
import { LoadedModule } from '@/types/modules';
import { useMutation } from '@tanstack/react-query';
import { modulePackager } from '@/services/modulePackager';
import { moduleVersionManager } from '@/services/moduleVersionManager';
import { toast } from 'sonner';
import ModuleDeploymentManager from './ModuleDeploymentManager';
import ModuleScalingDashboard from './ModuleScalingDashboard';

const ModuleDevSandbox: React.FC = () => {
  const { loadedModules, isLoading, error, reloadModule } = useModuleLoader();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  // Add debugging to track component lifecycle
  useEffect(() => {
    console.log('ModuleDevSandbox mounted');
    return () => {
      console.log('ModuleDevSandbox unmounted');
    };
  }, []);

  useEffect(() => {
    console.log('ModuleDevSandbox - loadedModules changed:', loadedModules?.length || 0);
  }, [loadedModules]);

  // Package module for deployment
  const packageMutation = useMutation({
    mutationFn: async (moduleId: string) => {
      const currentModule = loadedModules.find(m => m.manifest.id === moduleId);
      if (!currentModule) throw new Error('Module not found');
      
      // Increment patch version for development packaging
      const currentVersion = currentModule.manifest.version;
      const versionParts = currentVersion.split('.').map(Number);
      versionParts[2] = (versionParts[2] || 0) + 1;
      const newVersion = versionParts.join('.');
      
      return modulePackager.packageModule(moduleId, newVersion);
    },
    onSuccess: (modulePackage) => {
      toast.success(`Module ${modulePackage.id} packaged successfully`);
    },
    onError: (error) => {
      toast.error(`Packaging failed: ${error.message}`);
    },
  });

  // Hot-swap module version
  const hotSwapMutation = useMutation({
    mutationFn: ({ moduleId, version }: { moduleId: string; version: string }) => 
      moduleVersionManager.hotSwapModule(moduleId, version, 'dev-tenant'),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(`Hot-swapped ${result.oldVersion} → ${result.newVersion}`);
        reloadModule(result.newVersion.split('@')[0]);
      } else {
        toast.error(`Hot-swap failed: ${result.error}`);
      }
    },
    onError: (error) => {
      toast.error(`Hot-swap failed: ${error.message}`);
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'loaded': return 'bg-green-100 text-green-800';
      case 'loading': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'unloaded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderModuleDetails = (module: LoadedModule) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold">Module Information</h4>
          <div className="mt-2 space-y-1 text-sm">
            <p><strong>ID:</strong> {module.manifest.id}</p>
            <p><strong>Version:</strong> {module.manifest.version}</p>
            <p><strong>Category:</strong> {module.manifest.category}</p>
            <p><strong>Author:</strong> {module.manifest.author}</p>
          </div>
        </div>
        <div>
          <h4 className="font-semibold">Runtime Information</h4>
          <div className="mt-2 space-y-1 text-sm">
            <p><strong>Status:</strong> 
              <Badge className={`ml-2 ${getStatusColor(module.status)}`}>
                {module.status}
              </Badge>
            </p>
            <p><strong>Loaded At:</strong> {module.loadedAt.toLocaleTimeString()}</p>
            <p><strong>Dependencies:</strong> {module.dependencies.length}</p>
          </div>
        </div>
      </div>

      {module.manifest.dependencies.length > 0 && (
        <div>
          <h4 className="font-semibold">Dependencies</h4>
          <div className="mt-2 flex flex-wrap gap-2">
            {module.manifest.dependencies.map(dep => (
              <Badge key={dep} variant="outline">{dep}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Development Actions */}
      <div className="border-t pt-4">
        <h4 className="font-semibold mb-3">Development Actions</h4>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => packageMutation.mutate(module.manifest.id)}
            disabled={packageMutation.isPending}
          >
            <Package className="h-3 w-3 mr-1" />
            Package for Deployment
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => hotSwapMutation.mutate({ 
              moduleId: module.manifest.id, 
              version: module.manifest.version 
            })}
            disabled={hotSwapMutation.isPending}
          >
            <Zap className="h-3 w-3 mr-1" />
            Test Hot-Swap
          </Button>
        </div>
      </div>

      {module.error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="font-semibold text-red-800">Error</h4>
          <p className="text-red-700 text-sm mt-1">{module.error}</p>
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 animate-spin" />
            Loading Module Development Sandbox
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Initializing modules...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    console.error('ModuleDevSandbox error:', error);
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Square className="h-5 w-5" />
            Module Sandbox Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
            variant="outline"
          >
            Reload Page
          </Button>
        </CardContent>
      </Card>
    );
  }

  console.log('ModuleDevSandbox rendering with modules:', loadedModules?.length || 0);

  return (
    <div className="space-y-6">
      {/* Module Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Module Development Sandbox
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Isolated development environment with packaging, deployment, and scaling capabilities
          </p>
        </CardHeader>
        <CardContent>
          {!loadedModules || loadedModules.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No modules loaded yet</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {loadedModules.map(module => (
                <div
                  key={module.manifest.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedModule === module.manifest.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedModule(module.manifest.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{module.manifest.name}</h3>
                    <Badge className={getStatusColor(module.status)}>
                      {module.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {module.manifest.description}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        reloadModule(module.manifest.id);
                      }}
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Reload
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed View */}
      <Tabs defaultValue="development">
        <TabsList>
          <TabsTrigger value="development">Development</TabsTrigger>
          <TabsTrigger value="deployment">Deployment</TabsTrigger>
          <TabsTrigger value="scaling">Scaling & Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="development">
          {selectedModule && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Module Details: {loadedModules.find(m => m.manifest.id === selectedModule)?.manifest.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="manifest">Manifest</TabsTrigger>
                    <TabsTrigger value="components">Components</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="mt-4">
                    {renderModuleDetails(loadedModules.find(m => m.manifest.id === selectedModule)!)}
                  </TabsContent>

                  <TabsContent value="manifest" className="mt-4">
                    <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-auto">
                      {JSON.stringify(
                        loadedModules.find(m => m.manifest.id === selectedModule)?.manifest,
                        null,
                        2
                      )}
                    </pre>
                  </TabsContent>

                  <TabsContent value="components" className="mt-4">
                    <div className="space-y-2">
                      {loadedModules.find(m => m.manifest.id === selectedModule)?.manifest.components?.map(comp => (
                        <div key={comp.name} className="p-3 border rounded-lg">
                          <h4 className="font-semibold">{comp.name}</h4>
                          <p className="text-sm text-gray-600">{comp.path}</p>
                          <div className="mt-2">
                            <Badge variant="outline">Component</Badge>
                          </div>
                        </div>
                      )) || <p className="text-gray-500">No components defined</p>}
                    </div>
                  </TabsContent>

                  <TabsContent value="performance" className="mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-semibold text-green-800">Load Time</h4>
                        <p className="text-2xl font-bold text-green-900">~50ms</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-800">Memory Usage</h4>
                        <p className="text-2xl font-bold text-blue-900">2.1MB</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="deployment">
          <ModuleDeploymentManager />
        </TabsContent>

        <TabsContent value="scaling">
          <ModuleScalingDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModuleDevSandbox;
