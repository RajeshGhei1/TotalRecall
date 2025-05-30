
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
  UserRound
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import TalentMetricsDashboard from "@/components/talent/TalentMetricsDashboard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const TenantAdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  console.log('TenantAdminDashboard - Current user:', user);

  // Fetch tenant information for the current user
  const { data: tenantData, isLoading: tenantLoading, error: tenantError } = useQuery({
    queryKey: ['currentTenantData'],
    queryFn: async () => {
      console.log('Fetching tenant data for user:', user?.id);
      if (!user) return null;
      
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
    enabled: !!user,
  });

  // Early return with error display if there's an issue
  if (tenantError) {
    console.error('Tenant data error:', tenantError);
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Dashboard</h2>
            <p className="text-gray-600 mb-4">{tenantError.message}</p>
            <Button onClick={() => window.location.reload()}>Reload Page</Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Show loading state
  if (tenantLoading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Loading Dashboard...</h2>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Show message if user has no tenant association
  if (!tenantData) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-amber-600 mb-2">No Tenant Access</h2>
            <p className="text-gray-600 mb-4">
              You don't appear to be associated with any tenant. Please contact your administrator.
            </p>
            <Button onClick={() => navigate('/auth')}>Go to Login</Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  console.log('Rendering dashboard with tenant:', tenantData);

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Tenant Admin Dashboard</h1>
          {tenantData?.tenants?.name && (
            <div className="bg-jobmojo-primary text-white px-4 py-2 rounded-md">
              {tenantData.tenants.name}
            </div>
          )}
        </div>
        
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Welcome Back!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                <div className="text-lg font-bold">Tenant: {tenantData.tenants?.name}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => navigate('/tenant-admin/talent')}
                  className="w-full"
                >
                  Manage Talent
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => navigate('/tenant-admin/jobs')}
                  className="w-full"
                >
                  Manage Jobs
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => navigate('/tenant-admin/settings')}
                className="w-full"
              >
                <UserRound className="mr-2 h-4 w-4" />
                Tenant Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Simple Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Dashboard Status</CardTitle>
            <CardDescription>Your tenant dashboard is now loading successfully</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start border-b pb-3">
                <div className="rounded-full h-8 w-8 flex items-center justify-center mr-3 bg-green-100 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">Dashboard Successfully Loaded</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date().toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default TenantAdminDashboard;
