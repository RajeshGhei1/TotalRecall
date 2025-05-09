
import React from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Users, Building } from "lucide-react";

const TenantAdminDashboard = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Tenant Admin Dashboard</h1>
        
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Tenants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Database className="mr-2 h-4 w-4 text-muted-foreground" />
                <div className="text-2xl font-bold">0</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                <div className="text-2xl font-bold">0</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Tenants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                <div className="text-2xl font-bold">0</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Steps to set up your JobMojo.ai platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-jobmojo-primary text-white rounded-full h-6 w-6 flex items-center justify-center mr-3">
                  1
                </div>
                <div>
                  <h3 className="font-medium">Create Your First Tenant</h3>
                  <p className="text-sm text-muted-foreground">
                    Navigate to the Tenants section and create your first tenant organization.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-jobmojo-primary text-white rounded-full h-6 w-6 flex items-center justify-center mr-3">
                  2
                </div>
                <div>
                  <h3 className="font-medium">Assign Tenant Admins</h3>
                  <p className="text-sm text-muted-foreground">
                    Invite users and assign them as tenant administrators.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-jobmojo-primary text-white rounded-full h-6 w-6 flex items-center justify-center mr-3">
                  3
                </div>
                <div>
                  <h3 className="font-medium">Configure Platform Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Customize your platform settings in the Settings section.
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
