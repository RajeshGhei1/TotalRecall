
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
import { toast } from 'sonner';
import ModuleDeploymentManager from './ModuleDeploymentManager';
import ModuleScalingDashboard from './ModuleScalingDashboard';
import RealModuleDashboard from './RealModuleDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';

const ModuleDevSandbox: React.FC = () => {
  const { user, bypassAuth } = useAuth();

  // Get current tenant for super admin context
  const { data: tenantData } = useQuery({
    queryKey: ['superAdminTenantContext', user?.id],
    queryFn: async () => {
      if (bypassAuth) {
        return { tenant_id: 'super-admin-context' };
      }
      
      if (!user) return null;
      
      // Create a development tenant context for super admin
      return { tenant_id: 'dev-tenant-' + user.id };
    },
    enabled: !!user || bypassAuth,
  });

  // Add debugging to track component lifecycle
  useEffect(() => {
    console.log('ModuleDevSandbox mounted with real module discovery');
    return () => {
      console.log('ModuleDevSandbox unmounted');
    };
  }, []);

  useEffect(() => {
    console.log('ModuleDevSandbox - tenant context:', tenantData?.tenant_id);
  }, [tenantData]);

  console.log('ModuleDevSandbox rendering with real module system');

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Real Module Development Sandbox
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Development environment connected to the actual module system with real access control, subscription management, and usage analytics
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
              <span>Real-time Access Control</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-purple-600" />
              <span>Live Usage Analytics</span>
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
            Deployment
          </TabsTrigger>
          <TabsTrigger value="scaling" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Scaling & Performance
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
                Tools for developing and testing modules in the real system
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
                    <p><strong>Tenant Context:</strong> {tenantData?.tenant_id || 'Loading...'}</p>
                    <p><strong>User Role:</strong> Super Admin</p>
                  </div>
                  <div>
                    <p><strong>Environment:</strong> Development</p>
                    <p><strong>Module System:</strong> Connected</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deployment" className="mt-6">
          <ModuleDeploymentManager />
        </TabsContent>

        <TabsContent value="scaling" className="mt-6">
          <ModuleScalingDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModuleDevSandbox;
