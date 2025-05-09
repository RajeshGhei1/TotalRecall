
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const Settings = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/superadmin/dashboard">Superadmin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Settings</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Configure system-wide settings and manage access controls
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="access">Access Management</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>
                  Configure general platform settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">System Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Platform Name</p>
                      <p>JobMojo.ai</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Version</p>
                      <p>1.0.0</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Environment</p>
                      <p>Production</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                      <p>{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="access" className="space-y-4">
            <TenantAccessManager />
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Configure platform-wide security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Authentication</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure authentication settings for the platform
                  </p>
                  {/* Authentication settings would go here */}
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Password Policy</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure password requirements for all users
                  </p>
                  {/* Password policy settings would go here */}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

// Tenant Access Management Component
const TenantAccessManager = () => {
  const { data: tenantList = [], isLoading } = useQuery({
    queryKey: ['tenants-access'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenants')
        .select('id, name')
        .order('name');

      if (error) throw error;
      return data;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tenant Access Management</CardTitle>
        <CardDescription>
          Review and modify access settings for all tenants
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading tenant information...</div>
        ) : tenantList.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No tenants found
          </div>
        ) : (
          <div className="space-y-6">
            {tenantList.map((tenant) => (
              <TenantAccessCard key={tenant.id} tenantId={tenant.id} tenantName={tenant.name} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Individual Tenant Access Card Component
const TenantAccessCard = ({ tenantId, tenantName }: { tenantId: string; tenantName: string }) => {
  const { data: userCount = 0, isLoading: countLoading } = useQuery({
    queryKey: ['tenant-users-count', tenantId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('user_tenants')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', tenantId);

      if (error) throw error;
      return count || 0;
    },
  });

  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium">{tenantName}</h3>
          <p className="text-sm text-muted-foreground">
            {countLoading ? 'Loading user count...' : `${userCount} user(s)`}
          </p>
        </div>
        <div className="space-x-2">
          <a href={`/superadmin/tenants?highlight=${tenantId}`} className="text-sm underline text-blue-600">
            View Details
          </a>
        </div>
      </div>
    </div>
  );
};

export default Settings;
