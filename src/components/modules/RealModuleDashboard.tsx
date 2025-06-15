
import React, { useState } from 'react';
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
  BarChart3
} from 'lucide-react';
import { useRealModuleDiscovery, RealModuleInfo } from '@/hooks/useRealModuleDiscovery';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface RealModuleDashboardProps {
  tenantId?: string;
}

const RealModuleDashboard: React.FC<RealModuleDashboardProps> = ({ tenantId }) => {
  const { user, bypassAuth } = useAuth();
  const [selectedModule, setSelectedModule] = useState<RealModuleInfo | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get current tenant for super admin context
  const { data: tenantData } = useQuery({
    queryKey: ['currentTenantData', user?.id],
    queryFn: async () => {
      if (bypassAuth) {
        return { tenant_id: 'super-admin-context' };
      }
      
      if (!user) return null;
      
      return { tenant_id: 'dev-tenant-' + user.id };
    },
    enabled: !!user || bypassAuth,
  });

  const currentTenantId = tenantId || tenantData?.tenant_id;
  const { modules, isLoading, getModulesByCategory, getModulesByStatus, getModulesByAccess, totalModules, activeModules, availableModules } = useRealModuleDiscovery(currentTenantId);

  const getStatusColor = (status: RealModuleInfo['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'development': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAccessColor = (accessMethod: RealModuleInfo['accessMethod']) => {
    switch (accessMethod) {
      case 'subscription': return 'bg-blue-100 text-blue-800';
      case 'override': return 'bg-purple-100 text-purple-800';
      case 'core': return 'bg-green-100 text-green-800';
      case 'unavailable': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderModuleCard = (module: RealModuleInfo) => (
    <Card 
      key={module.id}
      className={`cursor-pointer transition-all hover:shadow-md ${
        selectedModule?.id === module.id ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={() => setSelectedModule(module)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{module.name}</CardTitle>
          <Badge className={getStatusColor(module.status)}>
            {module.status}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {module.description}
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span>Access:</span>
            <Badge variant="outline" className={getAccessColor(module.accessMethod)}>
              {module.accessMethod}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span>Category:</span>
            <span className="font-medium">{module.category}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span>Version:</span>
            <span className="font-medium">{module.version}</span>
          </div>
          {module.usage && (
            <div className="flex items-center justify-between text-xs">
              <span>Active Users:</span>
              <span className="font-medium">{module.usage.activeUsers}</span>
            </div>
          )}
        </div>
        <div className="flex gap-1 mt-3">
          {module.route && (
            <Button size="sm" variant="outline" className="h-6 text-xs">
              <ExternalLink className="h-3 w-3 mr-1" />
              View
            </Button>
          )}
          <Button size="sm" variant="outline" className="h-6 text-xs">
            <Settings className="h-3 w-3 mr-1" />
            Config
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderModuleDetails = (module: RealModuleInfo) => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{module.name}</CardTitle>
          <div className="flex gap-2">
            <Badge className={getStatusColor(module.status)}>
              {module.status}
            </Badge>
            <Badge className={getAccessColor(module.accessMethod)}>
              {module.accessMethod}
            </Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{module.description}</p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="access">Access Control</TabsTrigger>
            <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Module Information</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>ID:</strong> {module.id}</p>
                  <p><strong>Version:</strong> {module.version}</p>
                  <p><strong>Category:</strong> {module.category}</p>
                  <p><strong>Route:</strong> {module.route || 'N/A'}</p>
                  <p><strong>Component:</strong> {module.component || 'N/A'}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Access Information</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Access Method:</strong> {module.accessMethod}</p>
                  <p><strong>Tenant Assigned:</strong> {module.tenantAssigned ? 'Yes' : 'No'}</p>
                  <p><strong>Subscription Required:</strong> {module.subscriptionRequired ? 'Yes' : 'No'}</p>
                  {module.pricing && (
                    <p><strong>Pricing Tier:</strong> {module.pricing.tier}</p>
                  )}
                </div>
              </div>
            </div>
            
            {module.dependencies && module.dependencies.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Dependencies</h4>
                <div className="flex flex-wrap gap-1">
                  {module.dependencies.map(dep => (
                    <Badge key={dep} variant="outline">{dep}</Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="access" className="mt-4">
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">Current Access Status</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Access Method:</strong> {module.accessMethod}</p>
                    <p><strong>Tenant Assigned:</strong> {module.tenantAssigned ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <p><strong>Subscription Required:</strong> {module.subscriptionRequired ? 'Yes' : 'No'}</p>
                    <p><strong>Status:</strong> {module.status}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Shield className="h-4 w-4 mr-2" />
                  Test Access
                </Button>
                <Button size="sm" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Access
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="usage" className="mt-4">
            {module.usage && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-blue-600">Active Users</p>
                        <p className="text-2xl font-bold text-blue-900">{module.usage.activeUsers}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm text-green-600">Requests Today</p>
                        <p className="text-2xl font-bold text-green-900">{module.usage.requestsToday}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-sm text-purple-600">Last Accessed</p>
                        <p className="text-sm font-medium text-purple-900">
                          {module.usage.lastAccessed?.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="config" className="mt-4">
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">Module Configuration</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure module settings and parameters
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Config
                  </Button>
                  <Button size="sm" variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset to Default
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Modules</p>
                <p className="text-2xl font-bold">{totalModules}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Active Modules</p>
                <p className="text-2xl font-bold">{activeModules}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-2xl font-bold">{availableModules}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Usage Rate</p>
                <p className="text-2xl font-bold">{Math.round((availableModules / totalModules) * 100)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Module List */}
        <div className="col-span-5">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Discovered Modules</CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {modules.map(renderModuleCard)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Module Details */}
        <div className="col-span-7">
          {selectedModule ? (
            renderModuleDetails(selectedModule)
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a Module</h3>
                <p className="text-muted-foreground">
                  Choose a module from the list to view detailed information and development tools.
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
