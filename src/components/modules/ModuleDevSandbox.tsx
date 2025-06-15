
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  RefreshCw, 
  Code, 
  Layers,
  Activity,
  Package,
  Zap,
  TrendingUp,
  Settings,
  Monitor,
  Database
} from 'lucide-react';
import SimplifiedModuleDeployment from './SimplifiedModuleDeployment';
import SimplifiedModuleScaling from './SimplifiedModuleScaling';
import RealModuleDashboard from './RealModuleDashboard';
import { useStableTenantContext } from '@/hooks/useStableTenantContext';

const ModuleDevSandbox: React.FC = () => {
  // Use stable tenant context
  const { data: tenantData, isLoading: tenantLoading } = useStableTenantContext();

  // Add debugging to track component lifecycle
  useEffect(() => {
    console.log('ModuleDevSandbox mounted with stable tenant context');
    return () => {
      console.log('ModuleDevSandbox unmounted');
    };
  }, []);

  useEffect(() => {
    console.log('ModuleDevSandbox - stable tenant context:', tenantData);
  }, [tenantData]);

  if (tenantLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Stable Module Development Sandbox
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Development environment with stable tenant context and optimized module discovery
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-green-600" />
              <span>Connected to System Modules</span>
            </div>
            <div className="flex items-center gap-2">
              <Monitor className="h-4 w-4 text-blue-600" />
              <span>Stable Tenant Context</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-purple-600" />
              <span>Optimized Module Discovery</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs defaultValue="modules" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="modules" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Module Discovery
          </TabsTrigger>
          <TabsTrigger value="development" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Development Tools
          </TabsTrigger>
          <TabsTrigger value="deployment" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Package Management
          </TabsTrigger>
          <TabsTrigger value="scaling" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Performance Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="mt-6">
          <RealModuleDashboard tenantId={tenantData?.tenant_id} />
        </TabsContent>

        <TabsContent value="development" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Development Tools
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Tools for developing and testing modules with stable context
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Access Control Testing</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Test Module Access
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Database className="h-4 w-4 mr-2" />
                      Subscription Simulation
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Monitor className="h-4 w-4 mr-2" />
                      Access Log Viewer
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold">Module Debugging</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Activity className="h-4 w-4 mr-2" />
                      Performance Monitor
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Package className="h-4 w-4 mr-2" />
                      Dependency Tracker
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Hot Reload Test
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Development Environment Status</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Tenant Context:</strong> {tenantData?.tenant_name || 'Loading...'}</p>
                    <p><strong>Tenant ID:</strong> {tenantData?.tenant_id || 'N/A'}</p>
                  </div>
                  <div>
                    <p><strong>Environment:</strong> {tenantData?.is_development ? 'Development' : 'Production'}</p>
                    <p><strong>Module System:</strong> Connected</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deployment" className="mt-6">
          <SimplifiedModuleDeployment />
        </TabsContent>

        <TabsContent value="scaling" className="mt-6">
          <SimplifiedModuleScaling />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModuleDevSandbox;
