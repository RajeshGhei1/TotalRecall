
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Plus, 
  Trash2, 
  Edit3,
  CheckCircle,
  XCircle,
  Calendar,
  Activity
} from 'lucide-react';
import { useModuleConnections } from '@/hooks/modules/useModuleConnections';
import { useModuleUsageTracking } from '@/hooks/modules/useModuleUsageTracking';
import { useTenantContext } from '@/contexts/TenantContext';

interface ModuleConnectionManagerProps {
  moduleName: string;
  moduleDisplayName: string;
}

export const ModuleConnectionManager: React.FC<ModuleConnectionManagerProps> = ({
  moduleName,
  moduleDisplayName
}) => {
  const { selectedTenantId } = useTenantContext();
  const [activeTab, setActiveTab] = useState('connections');

  const { 
    connections, 
    isLoading, 
    createConnection, 
    updateConnection, 
    deleteConnection 
  } = useModuleConnections(moduleName, selectedTenantId || undefined);

  const { 
    usageData, 
    getCurrentPeriodUsage,
    checkUsageLimit 
  } = useModuleUsageTracking(selectedTenantId || undefined, moduleName);

  if (!selectedTenantId) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Settings className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Please select a tenant to manage module connections</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const handleCreateConnection = async (platform: string) => {
    try {
      await createConnection({
        platform,
        connection_config: {
          status: 'configured',
          created_by: 'admin'
        }
      });
    } catch (error) {
      console.error('Failed to create connection:', error);
    }
  };

  const handleDeleteConnection = async (id: string) => {
    try {
      await deleteConnection(id);
    } catch (error) {
      console.error('Failed to delete connection:', error);
    }
  };

  const handleToggleConnection = async (id: string, isActive: boolean) => {
    try {
      await updateConnection({
        id,
        updates: { is_active: !isActive }
      });
    } catch (error) {
      console.error('Failed to toggle connection:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{moduleDisplayName} Configuration</h3>
          <p className="text-sm text-gray-600">Manage connections and monitor usage for this module</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="usage">Usage & Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="connections" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Active Connections
              </CardTitle>
              <CardDescription>
                Manage platform connections for {moduleDisplayName.toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {connections.length === 0 ? (
                <div className="text-center py-8">
                  <Settings className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">No connections configured</p>
                  <Button onClick={() => handleCreateConnection('default')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Connection
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {connections.map((connection) => (
                    <div
                      key={connection.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          connection.is_active ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {connection.is_active ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium capitalize">{connection.platform}</p>
                          <p className="text-sm text-gray-500">
                            Connected {new Date(connection.connected_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={connection.is_active ? 'default' : 'secondary'}>
                          {connection.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleConnection(connection.id, connection.is_active)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteConnection(connection.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button onClick={() => handleCreateConnection('new_platform')} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Connection
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Current Month Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {getCurrentPeriodUsage(moduleName, 'requests')}
                </div>
                <p className="text-xs text-gray-500">requests this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {connections.filter(c => c.is_active).length}
                </div>
                <p className="text-xs text-gray-500">of {connections.length} total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Activity className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm font-medium">Operational</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Usage History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {usageData.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No usage data available</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {usageData.slice(0, 5).map((usage) => (
                    <div key={usage.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium capitalize">{usage.usage_type}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(usage.period_start).toLocaleDateString()} - {new Date(usage.period_end).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{usage.usage_count}</p>
                        <p className="text-sm text-gray-500">uses</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
