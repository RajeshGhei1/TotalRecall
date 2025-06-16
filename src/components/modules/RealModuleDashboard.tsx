import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
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
  Info,
  Search,
  Filter,
  Grid3X3,
  List
} from 'lucide-react';
import { useOptimizedModuleDiscovery, OptimizedModuleInfo } from '@/hooks/useOptimizedModuleDiscovery';
import { useStableTenantContext } from '@/hooks/useStableTenantContext';
import ModuleStatusViewer from './ModuleStatusViewer';

interface RealModuleDashboardProps {
  tenantId?: string;
}

const RealModuleDashboard: React.FC<RealModuleDashboardProps> = ({ tenantId }) => {
  const [selectedModule, setSelectedModule] = useState<OptimizedModuleInfo | null>(null);
  const [viewingModule, setViewingModule] = useState<OptimizedModuleInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'development'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

  // Filter modules based on search and filters
  const filteredModules = modules.filter(module => {
    const matchesSearch = module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || module.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || module.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Get unique categories
  const categories = Array.from(new Set(modules.map(m => m.category)));

  // Debug effect to track module discovery
  useEffect(() => {
    console.log('RealModuleDashboard: Module discovery update', {
      isLoading,
      totalModules,
      activeModules,
      availableModules,
      modulesLength: modules.length,
      filteredLength: filteredModules.length,
      tenantContext: tenantData,
      currentTenantId
    });
  }, [modules, filteredModules, isLoading, totalModules, activeModules, availableModules, tenantData, currentTenantId]);

  const handleOpenModule = (module: OptimizedModuleInfo) => {
    if (module.route) {
      window.open(module.route, '_blank');
    }
  };

  const handleViewModuleStatus = (module: OptimizedModuleInfo) => {
    setViewingModule(module);
  };

  const getStatusColor = (status: OptimizedModuleInfo['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'development': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAccessColor = (accessMethod: OptimizedModuleInfo['accessMethod']) => {
    switch (accessMethod) {
      case 'subscription': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'override': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'core': return 'bg-green-100 text-green-800 border-green-200';
      case 'unavailable': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
      case 'recruitment': return <Users className="h-5 w-5" />;
      case 'analytics': return <BarChart3 className="h-5 w-5" />;
      case 'business': return <Package className="h-5 w-5" />;
      case 'integration': return <Zap className="h-5 w-5" />;
      default: return <Package className="h-5 w-5" />;
    }
  };

  const renderModuleGridCard = (module: OptimizedModuleInfo) => (
    <Card 
      key={module.id}
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
        selectedModule?.id === module.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
      }`}
      onClick={() => setSelectedModule(module)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <div className={`p-2 rounded-lg ${getStatusColor(module.status).replace('text-', 'bg-').replace('-800', '-100')}`}>
            {getCategoryIcon(module.category)}
          </div>
          <div className="flex gap-1">
            <Badge variant="outline" className={`${getStatusColor(module.status)} text-xs`}>
              {getStatusIcon(module.status)}
              <span className="ml-1">{module.status}</span>
            </Badge>
          </div>
        </div>
        
        <CardTitle className="text-lg font-semibold mb-1">{module.name}</CardTitle>
        <Badge variant="outline" className={`${getAccessColor(module.accessMethod)} w-fit text-xs`}>
          <Shield className="h-3 w-3 mr-1" />
          {module.accessMethod}
        </Badge>
        
        {module.description && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{module.description}</p>
        )}
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span className="capitalize">{module.category}</span>
          <span>v{module.version}</span>
        </div>
        
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="h-7 text-xs flex-1"
            onClick={(e) => {
              e.stopPropagation();
              handleViewModuleStatus(module);
            }}
          >
            <Eye className="h-3 w-3 mr-1" />
            Status
          </Button>
          {module.route && (
            <Button 
              size="sm" 
              variant="outline" 
              className="h-7 text-xs flex-1"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenModule(module);
              }}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Open
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderModuleListItem = (module: OptimizedModuleInfo) => (
    <Card 
      key={module.id}
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        selectedModule?.id === module.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
      }`}
      onClick={() => setSelectedModule(module)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className={`p-2 rounded-lg ${getStatusColor(module.status).replace('text-', 'bg-').replace('-800', '-100')}`}>
              {getCategoryIcon(module.category)}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-semibold text-lg">{module.name}</h3>
                <Badge variant="outline" className={`${getStatusColor(module.status)} text-xs`}>
                  {getStatusIcon(module.status)}
                  <span className="ml-1">{module.status}</span>
                </Badge>
                <Badge variant="outline" className={`${getAccessColor(module.accessMethod)} text-xs`}>
                  <Shield className="h-3 w-3 mr-1" />
                  {module.accessMethod}
                </Badge>
              </div>
              {module.description && (
                <p className="text-sm text-gray-600 mb-2">{module.description}</p>
              )}
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="capitalize">Category: {module.category}</span>
                <span>Version: {module.version}</span>
                {module.route && <span>Route: {module.route}</span>}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="h-8"
              onClick={(e) => {
                e.stopPropagation();
                handleViewModuleStatus(module);
              }}
            >
              <Eye className="h-4 w-4 mr-2" />
              Status
            </Button>
            {module.route && (
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenModule(module);
                }}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open
              </Button>
            )}
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
      {/* Module Status Viewer Modal */}
      {viewingModule && (
        <ModuleStatusViewer 
          module={viewingModule} 
          onClose={() => setViewingModule(null)} 
        />
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Modules</p>
                <p className="text-3xl font-bold text-gray-900">{totalModules}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active Modules</p>
                <p className="text-3xl font-bold text-gray-900">{activeModules}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Available</p>
                <p className="text-3xl font-bold text-gray-900">{availableModules}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Availability Rate</p>
                <p className="text-3xl font-bold text-gray-900">
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
        <div className="col-span-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <CardTitle className="text-xl">Module Discovery</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Tenant: <span className="font-medium">{tenantData?.tenant_name || 'Loading...'}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant={viewMode === 'grid' ? 'default' : 'outline'} 
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant={viewMode === 'list' ? 'default' : 'outline'} 
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => window.location.reload()}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-4">
                <div className="relative flex-1 min-w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search modules..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-2 border border-input rounded-md text-sm bg-background"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="development">Development</option>
                </select>
                
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md text-sm bg-background"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category} className="capitalize">
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </CardHeader>
            
            <CardContent>
              {filteredModules.length > 0 ? (
                <div className={`${viewMode === 'grid' ? 'grid grid-cols-2 gap-4' : 'space-y-3'} max-h-[700px] overflow-y-auto`}>
                  {filteredModules.map(module => 
                    viewMode === 'grid' ? renderModuleGridCard(module) : renderModuleListItem(module)
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">No Modules Found</h3>
                  <p className="text-gray-600">
                    {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' 
                      ? 'No modules match the current filters' 
                      : 'No modules available'
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Module Details */}
        <div className="col-span-4">
          {selectedModule ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{selectedModule.name}</CardTitle>
                    <p className="text-gray-600 mt-1">{selectedModule.description}</p>
                  </div>
                  <div className="flex flex-col gap-2">
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
                {/* Module Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 border-b pb-2">Module Information</h4>
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">ID:</span>
                      <code className="text-gray-900 bg-gray-100 px-2 py-1 rounded text-xs">{selectedModule.id}</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Version:</span>
                      <span className="font-medium">{selectedModule.version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium capitalize">{selectedModule.category}</span>
                    </div>
                    {selectedModule.component && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Component:</span>
                        <span className="font-medium">{selectedModule.component}</span>
                      </div>
                    )}
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
                <div className="flex flex-col gap-2 pt-4 border-t">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleViewModuleStatus(selectedModule)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Status & Details
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                  {selectedModule.route && (
                    <Button 
                      size="sm" 
                      variant="default" 
                      className="w-full"
                      onClick={() => handleOpenModule(selectedModule)}
                    >
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
