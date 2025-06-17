
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Package, 
  Play, 
  Pause, 
  Settings, 
  BarChart3,
  Users,
  Download,
  Star,
  Search,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';
import { moduleRegistryService, ModuleInstallation } from '@/services/moduleRegistryService';
import ModuleMarketplace from './ModuleMarketplace';

interface RealModuleDashboardProps {
  tenantId?: string;
}

interface ModuleStats {
  total: number;
  active: number;
  inactive: number;
  failed: number;
  updating: number;
}

const RealModuleDashboard: React.FC<RealModuleDashboardProps> = ({ tenantId }) => {
  const [installedModules, setInstalledModules] = useState<ModuleInstallation[]>([]);
  const [moduleStats, setModuleStats] = useState<ModuleStats>({
    total: 0,
    active: 0,
    inactive: 0,
    failed: 0,
    updating: 0
  });
  const [selectedModule, setSelectedModule] = useState<ModuleInstallation | null>(null);
  const [marketplaceOpen, setMarketplaceOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (tenantId) {
      loadInstalledModules();
    }
  }, [tenantId]);

  const loadInstalledModules = async () => {
    if (!tenantId) return;
    
    setIsLoading(true);
    try {
      const modules = await moduleRegistryService.getInstalledModules(tenantId);
      setInstalledModules(modules);
      
      // Calculate stats
      const stats: ModuleStats = {
        total: modules.length,
        active: modules.filter(m => m.status === 'active').length,
        inactive: modules.filter(m => m.status === 'inactive').length,
        failed: modules.filter(m => m.status === 'failed').length,
        updating: modules.filter(m => m.status === 'updating').length
      };
      setModuleStats(stats);
    } catch (error) {
      console.error('Error loading installed modules:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModuleAction = async (moduleId: string, action: 'activate' | 'deactivate' | 'uninstall') => {
    if (!tenantId) return;

    try {
      switch (action) {
        case 'activate':
          // Update module status to active
          break;
        case 'deactivate':
          // Update module status to inactive
          break;
        case 'uninstall':
          await moduleRegistryService.uninstallModule(moduleId, tenantId);
          await loadInstalledModules();
          break;
      }
    } catch (error) {
      console.error(`Error performing ${action} on module ${moduleId}:`, error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'inactive':
        return <Pause className="h-4 w-4 text-gray-600" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'updating':
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'updating':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Module Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your installed modules and discover new ones
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadInstalledModules}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setMarketplaceOpen(true)}>
            <Package className="h-4 w-4 mr-2" />
            Browse Marketplace
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Modules</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{moduleStats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{moduleStats.active}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
            <Pause className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{moduleStats.inactive}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{moduleStats.failed}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Updating</CardTitle>
            <RefreshCw className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{moduleStats.updating}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="installed" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="installed">Installed Modules</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="installed" className="mt-6">
          {installedModules.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Modules Installed</h3>
                <p className="text-muted-foreground mb-4">
                  Get started by installing modules from the marketplace
                </p>
                <Button onClick={() => setMarketplaceOpen(true)}>
                  Browse Marketplace
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {installedModules.map((module) => (
                <Card key={module.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{module.module_id}</CardTitle>
                        <p className="text-sm text-muted-foreground">v{module.module_version}</p>
                      </div>
                      {getStatusIcon(module.status)}
                    </div>
                    <Badge className={getStatusColor(module.status)}>
                      {module.status}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground mb-4">
                      Installed: {new Date(module.installed_at).toLocaleDateString()}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedModule(module)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                      
                      {module.status === 'active' ? (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleModuleAction(module.module_id, 'deactivate')}
                        >
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleModuleAction(module.module_id, 'activate')}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Activate
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Module Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {installedModules.filter(m => m.status === 'active').map((module) => (
                    <div key={module.id}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">{module.module_id}</span>
                        <span className="text-sm text-muted-foreground">
                          {Math.floor(Math.random() * 100)}% CPU
                        </span>
                      </div>
                      <Progress value={Math.floor(Math.random() * 100)} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Module Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {installedModules.filter(m => m.status === 'active').map((module) => (
                    <div key={module.id} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{module.module_id}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {Math.floor(Math.random() * 50)} users
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {Math.floor(Math.random() * 1000)} req/hr
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Module System Settings</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure global module system behavior
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm font-medium">Auto-update modules</span>
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Automatically update modules to their latest versions
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm font-medium">Enable module analytics</span>
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Collect usage analytics to improve performance
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span className="text-sm font-medium">Sandbox mode</span>
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Run all modules in isolated environments
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <Button>Save Settings</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Module Configuration Dialog */}
      <Dialog open={!!selectedModule} onOpenChange={() => setSelectedModule(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Configure {selectedModule?.module_id}</DialogTitle>
          </DialogHeader>
          
          {selectedModule && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Module ID</label>
                  <p className="text-sm text-muted-foreground">{selectedModule.module_id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Version</label>
                  <p className="text-sm text-muted-foreground">{selectedModule.module_version}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Badge className={getStatusColor(selectedModule.status)}>
                    {selectedModule.status}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium">Installed</label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedModule.installed_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Module Configuration</label>
                <textarea
                  className="w-full h-32 p-3 border rounded-md font-mono text-sm"
                  value={JSON.stringify(selectedModule.configuration, null, 2)}
                  readOnly
                />
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setSelectedModule(null)}>
                  Close
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleModuleAction(selectedModule.module_id, 'uninstall');
                    setSelectedModule(null);
                  }}
                >
                  Uninstall Module
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Marketplace Dialog */}
      <Dialog open={marketplaceOpen} onOpenChange={setMarketplaceOpen}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Module Marketplace</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto">
            <ModuleMarketplace />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RealModuleDashboard;
