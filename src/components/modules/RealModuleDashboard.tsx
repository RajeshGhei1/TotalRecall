
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  Download, 
  Settings, 
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock,
  Trash2,
  Play,
  Pause
} from 'lucide-react';
import { moduleRegistryService, ModuleInstallation } from '@/services/moduleRegistryService';

interface RealModuleDashboardProps {
  tenantId?: string;
}

const RealModuleDashboard: React.FC<RealModuleDashboardProps> = ({ tenantId }) => {
  const [availableModules, setAvailableModules] = useState<any[]>([]);
  const [installedModules, setInstalledModules] = useState<ModuleInstallation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available');

  useEffect(() => {
    loadModules();
  }, [tenantId]);

  const loadModules = async () => {
    setIsLoading(true);
    try {
      await moduleRegistryService.initialize();
      
      const available = moduleRegistryService.getAllModules();
      const installed = moduleRegistryService.getInstalledModules();
      
      setAvailableModules(available);
      setInstalledModules(installed);
    } catch (error) {
      console.error('Error loading modules:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactive':
        return <Pause className="h-4 w-4 text-gray-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const handleInstallModule = async (moduleId: string) => {
    try {
      console.log(`Installing module: ${moduleId}`);
      // In a real implementation, this would install the module
      await loadModules(); // Refresh the list
    } catch (error) {
      console.error(`Error installing module ${moduleId}:`, error);
    }
  };

  const handleUninstallModule = async (moduleId: string) => {
    try {
      await moduleRegistryService.uninstallModule(moduleId);
      await loadModules(); // Refresh the list
    } catch (error) {
      console.error(`Error uninstalling module ${moduleId}:`, error);
    }
  };

  const renderAvailableModules = () => (
    <div className="grid gap-4">
      {availableModules.map((module) => (
        <Card key={module.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{module.manifest.name}</h3>
                  <Badge variant="outline">{module.manifest.category}</Badge>
                  <Badge variant="secondary">v{module.manifest.version}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {module.manifest.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Author: {module.manifest.author}</span>
                  <span>License: {module.manifest.license}</span>
                  {module.manifest.dependencies.length > 0 && (
                    <span>Dependencies: {module.manifest.dependencies.length}</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => handleInstallModule(module.id)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Install
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderInstalledModules = () => (
    <div className="grid gap-4">
      {installedModules.map((installation) => (
        <Card key={installation.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(installation.status)}
                  <h3 className="font-semibold">
                    {moduleRegistryService.getModule(installation.moduleId)?.manifest.name || installation.moduleId}
                  </h3>
                  {getStatusBadge(installation.status)}
                  <Badge variant="secondary">v{installation.version}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Installed: {installation.installedAt.toLocaleDateString()}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Tenant: {installation.tenantId}</span>
                  <span>Status: {installation.status}</span>
                </div>
              </div>
              <div className="flex gap-2">
                {installation.status === 'active' && (
                  <Button variant="outline" size="sm">
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </Button>
                )}
                {installation.status === 'inactive' && (
                  <Button variant="outline" size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Resume
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleUninstallModule(installation.moduleId)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Uninstall
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading modules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Module Dashboard</h2>
          <p className="text-muted-foreground">
            Manage and monitor your installed modules
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {availableModules.length} available
          </Badge>
          <Badge variant="outline" className="text-sm">
            {installedModules.length} installed
          </Badge>
          <Button onClick={loadModules}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="available" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Available ({availableModules.length})
          </TabsTrigger>
          <TabsTrigger value="installed" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Installed ({installedModules.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="mt-6">
          {availableModules.length > 0 ? (
            renderAvailableModules()
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No modules available</h3>
              <p className="text-gray-600">
                Check back later for new modules
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="installed" className="mt-6">
          {installedModules.length > 0 ? (
            renderInstalledModules()
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No modules installed</h3>
              <p className="text-gray-600">
                Install modules from the available tab to get started
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RealModuleDashboard;
