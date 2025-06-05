
import React from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, 
  BriefcaseIcon, 
  Building, 
  TrendingUp, 
  MessageSquare,
  CalendarDays,
  PenLine,
  UserRound,
  Zap,
  Activity
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { WorkflowHealthWidget } from "@/components/dashboard/widgets";

const TenantAdminDashboard = () => {
  const { user, bypassAuth } = useAuth();
  const navigate = useNavigate();

  console.log('TenantAdminDashboard - Current user:', user);
  console.log('TenantAdminDashboard - Bypass auth:', bypassAuth);

  // Fetch tenant information for the current user
  const { data: tenantData, isLoading: tenantLoading, error: tenantError } = useQuery({
    queryKey: ['currentTenantData', user?.id],
    queryFn: async () => {
      console.log('Fetching tenant data for user:', user?.id);
      
      // In bypass mode, return mock data
      if (bypassAuth) {
        console.log('Using mock tenant data in bypass mode');
        return {
          tenant_id: 'mock-tenant-id',
          tenants: {
            id: 'mock-tenant-id',
            name: 'Development Tenant',
            description: 'Mock tenant for development'
          }
        };
      }
      
      if (!user) {
        console.log('No user found, returning null');
        return null;
      }
      
      const { data, error } = await supabase
        .from('user_tenants')
        .select(`
          tenant_id,
          tenants:tenant_id (
            id,
            name,
            description
          )
        `)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching tenant data:', error);
        throw error;
      }
      
      console.log('Tenant data result:', data);
      return data;
    },
    enabled: !!user || bypassAuth,
    retry: 1,
  });

  console.log('Dashboard state:', { tenantData, tenantLoading, tenantError, user, bypassAuth });

  // Handle loading state
  if (tenantLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Loading Dashboard...</h2>
            <p className="text-gray-600">Fetching your tenant information...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Handle error state
  if (tenantError) {
    console.error('Tenant data error:', tenantError);
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Dashboard</h2>
            <p className="text-gray-600 mb-4">
              {tenantError.message || 'Unable to load tenant information'}
            </p>
            <div className="space-x-4">
              <Button onClick={() => window.location.reload()}>Reload Page</Button>
              <Button variant="outline" onClick={() => navigate('/auth')}>Go to Login</Button>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Handle no tenant access
  if (!tenantData && !bypassAuth) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Building className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold text-amber-600 mb-2">No Tenant Access</h2>
            <p className="text-gray-600 mb-4">
              You don't appear to be associated with any tenant organization. 
              Please contact your administrator to get access.
            </p>
            <div className="space-x-4">
              <Button onClick={() => navigate('/auth')}>Go to Login</Button>
              <Button variant="outline" onClick={() => window.location.reload()}>Refresh</Button>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const tenantName = tenantData?.tenants?.name || 'Development Tenant';

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Tenant Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome to your tenant administration panel
            </p>
          </div>
          <div className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
            <Building className="inline-block mr-2 h-4 w-4" />
            {tenantName}
          </div>
        </div>
        
        {/* Quick Stats Grid */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Welcome Back!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tenantName}</div>
              <p className="text-xs text-muted-foreground">Your organization</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <BriefcaseIcon className="mr-2 h-4 w-4" />
                Jobs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">Active positions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <UserRound className="mr-2 h-4 w-4" />
                Candidates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">In pipeline</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <TrendingUp className="mr-2 h-4 w-4" />
                Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+0%</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Workflow Health Widget */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          <WorkflowHealthWidget tenantId={tenantData?.tenant_id} />
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                AI Automation
              </CardTitle>
              <CardDescription>
                Intelligent workflow automation insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-blue-900">Workflow Efficiency</p>
                  <p className="text-sm text-blue-700">AI has optimized 3 processes this week</p>
                </div>
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
              
              <Button 
                onClick={() => navigate('/tenant-admin/intelligent-workflows')}
                className="w-full"
              >
                <Zap className="mr-2 h-4 w-4" />
                Manage Workflows
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                onClick={() => navigate('/tenant-admin/talent')}
                className="w-full justify-start"
              >
                <Users className="mr-2 h-4 w-4" />
                Manage Talent Pool
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/tenant-admin/jobs')}
                className="w-full justify-start"
              >
                <BriefcaseIcon className="mr-2 h-4 w-4" />
                Post New Job
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/tenant-admin/ats')}
                className="w-full justify-start"
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                View Applications
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/tenant-admin/intelligent-workflows')}
                className="w-full justify-start"
              >
                <Zap className="mr-2 h-4 w-4" />
                Intelligent Workflows
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/tenant-admin/settings')}
                className="w-full justify-start"
              >
                <UserRound className="mr-2 h-4 w-4" />
                Tenant Settings
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start border-b pb-3">
                  <div className="rounded-full h-8 w-8 flex items-center justify-center mr-3 bg-green-100 text-green-600">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Dashboard Access Granted</p>
                    <p className="text-xs text-muted-foreground">
                      Successfully connected to {tenantName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date().toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start border-b pb-3">
                  <div className="rounded-full h-8 w-8 flex items-center justify-center mr-3 bg-purple-100 text-purple-600">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Intelligent Workflows Ready</p>
                    <p className="text-xs text-muted-foreground">
                      AI-powered automation is now available
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="rounded-full h-8 w-8 flex items-center justify-center mr-3 bg-blue-100 text-blue-600">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">System Ready</p>
                    <p className="text-xs text-muted-foreground">
                      Your tenant admin panel is now active
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default TenantAdminDashboard;
