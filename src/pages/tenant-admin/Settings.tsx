import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import AdminLayout from "@/components/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CustomFieldsManager from "@/components/CustomFieldsManager";

const TenantAdminSettings = () => {
  const { user } = useAuth();
  const tenantId = user?.tenant_id || "";

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Settings</h1>

        <Tabs defaultValue="general" className="w-full">
          <TabsList>
            <TabsTrigger value="general">General Settings</TabsTrigger>
            <TabsTrigger value="custom-fields">Custom Fields</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Manage your tenant account settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Configure general settings for your tenant.</p>
                {/* General settings form will go here */}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="custom-fields">
            <Card>
              <CardHeader>
                <CardTitle>Custom Fields Management</CardTitle>
                <CardDescription>
                  Create and manage custom fields for your talent and job profiles
                </CardDescription>
              </CardHeader>
              <CardContent>
                {tenantId ? (
                  <CustomFieldsManager tenantId={tenantId} />
                ) : (
                  <div className="text-center py-8 border rounded-md">
                    <p className="text-muted-foreground">
                      You need to be part of a tenant to manage custom fields.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Notification settings will go here.</p>
                {/* Notification settings form will go here */}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default TenantAdminSettings;
