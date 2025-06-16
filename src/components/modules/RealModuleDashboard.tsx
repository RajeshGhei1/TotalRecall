
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity,
  Package,
  Users,
  Zap,
  TrendingUp,
  Settings,
  Eye,
  PlayCircle,
  StopCircle,
  RefreshCw,
  ExternalLink,
  Shield,
  Clock,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { useOptimizedModuleDiscovery, OptimizedModuleInfo } from '@/hooks/useOptimizedModuleDiscovery';
import { useStableTenantContext } from '@/hooks/useStableTenantContext';

interface RealModuleDashboardProps {
  tenantId?: string;
}

const RealModuleDashboard: React.FC<RealModuleDashboardProps> = ({ tenantId }) => {
  const [selectedModule, setSelectedModule] = useState<OptimizedModuleInfo | null>(null);

  // Use stable tenant context
  const { data: tenantData } = useStableTenantContext();
  const currentTenantId = tenantId || tenantData?.tenant_id;
  
  // Use optimized module discovery
  const { 
    modules, 
    isLoading, 
    getModulesByCategory, 
    getModulesByStatus, 
    getModulesByAccess, 
    totalModules, 
    activeModules, 
    availableModules 
  } = useOptimizedModuleDiscovery(currentTenantId);

  // Debug effect to track module discovery
  useEffect(() => {
    console.log('RealModuleDashboard: Module discovery update', {
      isLoading,
      totalModules,
      activeModules,
      availableModules,
      modulesLength: modules.length,
      tenantContext: tenantData,
      currentTenantId
    });
  }, [modules, isLoading, totalModules, activeModules, availableModules, tenantData, currentTenantId]);

  const getStatusColor = (status: OptimizedModuleInfo['status']) => {
    switch (status) {
      case 'active': return 'bg-green-50 text-green-700 border-green-200';
      case 'inactive': return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'development': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getAccessColor = (accessMethod: OptimizedModuleInfo['accessMethod']) => {
    switch (accessMethod) {
      case 'subscription': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'override': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'core': return 'bg-green-50 text-green-700 border-green-200';
      case 'unavailable': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: OptimizedModuleInfo['status']) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'inactive': return <StopCircle className="h-4 w-4" />;
      case 'development': return <AlertCircle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'recruitment': return <Users className="h-4 w-4" />;
      case 'analytics': return <BarChart3 className="h-4 w-4" />;
      case 'business': return <Package className="h-4 w-4" />;
      case 'integration': return <Zap className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const renderModuleCard = (module: OptimizedModuleInfo) => (
    <Card 
      key={module.id}
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
        selectedModule?.id === module.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
      } border-l-4 ${getStatusColor(module.status).split(' ')[2]}`}
      onClick={() => setSelectedModule(module)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${getStatusColor(module.status).replace('text-', 'bg-').replace('-700', '-100')}`}>
              {getCategoryIcon(module.category)}
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                {module.name}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`${getStatusColor(module.status)} border text-xs font-medium`}>
                  {getStatusIcon(module.status)}
                  <span className="ml-1 capitalize">{module.status}</span>
                </Badge>
                <Badge variant="outline" className={`${getAccessColor(module.accessMethod)} border text-xs font-medium`}>
                  <Shield className="h-3 w-3 mr-1" />
                  {module.accessMethod}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        
        {module.description && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2 leading-relaxed">
            {module.description}
          </p>
        )}
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Module Details */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Category:</span>
              <span className="font-medium text-gray-900 capitalize">{module.category}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Version:</span>
              <span className="font-medium text-gray-900">{module.version}</span>
            </div>
          </div>

          {/* Route Information */}
          {module.route && (
            <div className="p-2 bg-gray-50 rounded text-xs">
              <span className="text-gray-500">Route: </span>
              <code className="text-blue-600 font-mono">{module.route}</code>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            {module.route && (
              <Button size="sm" variant="outline" className="h-7 text-xs flex-1">
                <ExternalLink className="h-3 w-3 mr-1" />
                Open
              </Button>
            )}
            <Button size="sm" variant="outline" className="h-7 text-xs flex-1">
              <Settings className="h-3 w-3 mr-1" />
              Config
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold mb-2">Loading Modules</h3>
          <p className="text-gray-600">Discovering available modules...</p>
        </div>
      </div>
    );
  }

  // Show a message if no modules are discovered
  if (totalModules === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-gray-900">No Modules Discovered</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            No modules are currently available in the system. This might be due to configuration issues or the system is still initializing.
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Discovery
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Modules</p>
                <p className="text-2xl font-bold text-gray-900">{totalModules}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active Modules</p>
                <p className="text-2xl font-bold text-gray-900">{activeModules}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-gray-900">{availableModules}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Availability Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalModules > 0 ? Math.round((availableModules / totalModules) * 100) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Module List */}
        <div className="col-span-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Discovered Modules</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Tenant: <span className="font-medium">{tenantData?.tenant_name || 'Loading...'}</span>
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={() => window.location.reload()}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {modules.length > 0 ? (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {modules.map(renderModuleCard)}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">No Modules Found</h3>
                  <p className="text-gray-600">No modules match the current criteria</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Module Details */}
        <div className="col-span-6">
          {selectedModule ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{selectedModule.name}</CardTitle>
                    <p className="text-gray-600 mt-1">{selectedModule.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(selectedModule.status)}>
                      {getStatusIcon(selectedModule.status)}
                      <span className="ml-1 capitalize">{selectedModule.status}</span>
                    </Badge>
                    <Badge className={getAccessColor(selectedModule.accessMethod)}>
                      <Shield className="h-3 w-3 mr-1" />
                      {selectedModule.accessMethod}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Module Information Grid */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 border-b pb-2">Module Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">ID:</span>
                        <code className="text-gray-900 bg-gray-100 px-2 py-1 rounded">{selectedModule.id}</code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Version:</span>
                        <span className="font-medium">{selectedModule.version}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium capitalize">{selectedModule.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Component:</span>
                        <span className="font-medium">{selectedModule.component || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 border-b pb-2">Access Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Access Method:</span>
                        <Badge variant="outline" className={getAccessColor(selectedModule.accessMethod)}>
                          {selectedModule.accessMethod}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tenant Assigned:</span>
                        <span className={`font-medium ${selectedModule.tenantAssigned ? 'text-green-600' : 'text-gray-500'}`}>
                          {selectedModule.tenantAssigned ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subscription Required:</span>
                        <span className={`font-medium ${selectedModule.subscriptionRequired ? 'text-orange-600' : 'text-gray-500'}`}>
                          {selectedModule.subscriptionRequired ? 'Yes' : 'No'}
                        </span>
                      </div>
                      {selectedModule.pricing && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Pricing Tier:</span>
                          <span className="font-medium capitalize">{selectedModule.pricing.tier}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Route Information */}
                {selectedModule.route && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 border-b pb-2">Route Information</h4>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <code className="text-blue-600 font-mono text-sm">{selectedModule.route}</code>
                    </div>
                  </div>
                )}
                
                {/* Dependencies */}
                {selectedModule.dependencies && selectedModule.dependencies.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 border-b pb-2">Dependencies</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedModule.dependencies.map(dep => (
                        <Badge key={dep} variant="outline" className="bg-gray-50">
                          {dep}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Shield className="h-4 w-4 mr-2" />
                    Test Access
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                  {selectedModule.route && (
                    <Button size="sm" variant="default" className="flex-1">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Module
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="mb-4">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Select a Module</h3>
                <p className="text-gray-600 max-w-sm mx-auto">
                  Choose a module from the list to view detailed information, configuration options, and development tools.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default RealModuleDashboard;
