
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
  CalendarDays 
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import TalentMetricsDashboard from "@/components/talent/TalentMetricsDashboard";

const TenantAdminDashboard = () => {
  const { user } = useAuth();

  // Fetch tenant information for the current user
  const { data: tenantData, isLoading: tenantLoading } = useQuery({
    queryKey: ['currentTenantData'],
    queryFn: async () => {
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
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch dashboard metrics
  const { data: dashboardMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['tenantDashboardMetrics', tenantData?.tenant_id],
    queryFn: async () => {
      if (!tenantData?.tenant_id) return {
        talentCount: 0,
        jobCount: 0,
        activeInterviewsCount: 0,
        messagesCount: 0
      };

      // In a real app, we'd query for actual metrics related to this tenant
      // For now, we're using mock data
      return {
        talentCount: 42,
        jobCount: 15,
        activeInterviewsCount: 8,
        messagesCount: 24
      };
    },
    enabled: !!tenantData?.tenant_id,
  });

  // Fetch recent activities
  const { data: recentActivities = [] } = useQuery({
    queryKey: ['recentActivities', tenantData?.tenant_id],
    queryFn: async () => {
      if (!tenantData?.tenant_id) return [];
      
      // Mock recent activities
      return [
        { id: 1, type: "talent_added", description: "New candidate added: John Smith", timestamp: new Date().toISOString() },
        { id: 2, type: "interview_scheduled", description: "Interview scheduled with Maria Garcia", timestamp: new Date(Date.now() - 86400000).toISOString() },
        { id: 3, type: "job_posted", description: "New job posted: Senior React Developer", timestamp: new Date(Date.now() - 172800000).toISOString() },
        { id: 4, type: "candidate_hired", description: "Candidate hired: Alex Wong", timestamp: new Date(Date.now() - 259200000).toISOString() },
      ];
    },
    enabled: !!tenantData?.tenant_id,
  });

  const isLoading = tenantLoading || metricsLoading;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Tenant Admin Dashboard</h1>
          {tenantData?.tenants?.name && (
            <div className="bg-jobmojo-primary text-white px-4 py-2 rounded-md">
              {tenantData.tenants.name}
            </div>
          )}
        </div>
        
        {isLoading ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(i => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Loading...
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="animate-pulse h-6 w-16 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Talent Pool
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="text-2xl font-bold">{dashboardMetrics?.talentCount || 0}</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Jobs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <BriefcaseIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="text-2xl font-bold">{dashboardMetrics?.jobCount || 0}</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Scheduled Interviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="text-2xl font-bold">{dashboardMetrics?.activeInterviewsCount || 0}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Unread Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <MessageSquare className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="text-2xl font-bold">{dashboardMetrics?.messagesCount || 0}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates in your recruitment process</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length === 0 ? (
                <p className="text-muted-foreground">No recent activities</p>
              ) : (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start border-b last:border-0 pb-3 last:pb-0">
                    <div className={`rounded-full h-8 w-8 flex items-center justify-center mr-3 ${
                      activity.type === 'talent_added' ? 'bg-green-100 text-green-600' :
                      activity.type === 'interview_scheduled' ? 'bg-blue-100 text-blue-600' :
                      activity.type === 'job_posted' ? 'bg-amber-100 text-amber-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {activity.type === 'talent_added' && <Users className="h-4 w-4" />}
                      {activity.type === 'interview_scheduled' && <CalendarDays className="h-4 w-4" />}
                      {activity.type === 'job_posted' && <BriefcaseIcon className="h-4 w-4" />}
                      {activity.type === 'candidate_hired' && <TrendingUp className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-medium">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Talent Metrics Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Talent Metrics</CardTitle>
            <CardDescription>Insights into your talent pool</CardDescription>
          </CardHeader>
          <CardContent>
            <TalentMetricsDashboard />
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to manage your recruitment platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center p-4 border rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
                <Users className="h-8 w-8 text-jobmojo-primary mb-2" />
                <span className="font-medium">Add New Talent</span>
              </div>
              <div className="flex flex-col items-center p-4 border rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
                <BriefcaseIcon className="h-8 w-8 text-jobmojo-primary mb-2" />
                <span className="font-medium">Post New Job</span>
              </div>
              <div className="flex flex-col items-center p-4 border rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
                <Building className="h-8 w-8 text-jobmojo-primary mb-2" />
                <span className="font-medium">Add Company</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default TenantAdminDashboard;
