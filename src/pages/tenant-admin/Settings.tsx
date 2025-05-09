
import React, { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PenSquare } from "lucide-react";

const TenantAdminSettings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("general");

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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Tenant Settings</h1>
          {tenantData?.tenants?.name && (
            <div className="bg-jobmojo-primary text-white px-4 py-2 rounded-md">
              {tenantData.tenants.name}
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 md:w-[600px]">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="customization">Customization</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Manage your tenant's general settings and information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {tenantLoading ? (
                  <div className="space-y-4">
                    <div className="h-8 bg-gray-200 rounded animate-pulse" />
                    <div className="h-24 bg-gray-200 rounded animate-pulse" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="tenant-name">Tenant Name</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="tenant-name"
                          defaultValue={tenantData?.tenants?.name || ""}
                          className="flex-1"
                        />
                        <Button size="sm" className="flex-none">
                          <PenSquare className="h-4 w-4 mr-2" /> Edit
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tenant-description">Description</Label>
                      <div className="flex items-start gap-2">
                        <Textarea
                          id="tenant-description"
                          rows={4}
                          defaultValue={tenantData?.tenants?.description || ""}
                          className="flex-1"
                        />
                        <Button size="sm" className="flex-none">
                          <PenSquare className="h-4 w-4 mr-2" /> Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                <Button
                  onClick={() => {
                    toast({
                      title: "Settings saved",
                      description: "Your tenant settings have been updated successfully",
                    });
                  }}
                >
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Job Alerts</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified when new jobs matching your criteria are posted
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Candidate Updates</p>
                      <p className="text-sm text-muted-foreground">
                        Notifications when candidates update their profiles
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Weekly Digest</p>
                      <p className="text-sm text-muted-foreground">
                        Receive a weekly summary of activities
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                <Button
                  onClick={() => {
                    toast({
                      title: "Notification settings saved",
                      description:
                        "Your notification preferences have been updated successfully",
                    });
                  }}
                >
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Integrations</CardTitle>
                <CardDescription>
                  Connect with third-party services and tools
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border p-4 rounded-md">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gray-100 p-2 rounded-md">
                        <img
                          src="https://cdn.cdnlogo.com/logos/g/35/google-icon.svg"
                          alt="Google"
                          className="w-8 h-8"
                        />
                      </div>
                      <div>
                        <p className="font-medium">Google Calendar</p>
                        <p className="text-sm text-muted-foreground">
                          Sync interviews and events
                        </p>
                      </div>
                    </div>
                    <Button variant="outline">Connect</Button>
                  </div>

                  <div className="flex items-center justify-between border p-4 rounded-md">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gray-100 p-2 rounded-md">
                        <img
                          src="https://cdn.cdnlogo.com/logos/s/40/slack-new.svg"
                          alt="Slack"
                          className="w-8 h-8"
                        />
                      </div>
                      <div>
                        <p className="font-medium">Slack</p>
                        <p className="text-sm text-muted-foreground">
                          Get notifications in your Slack channels
                        </p>
                      </div>
                    </div>
                    <Button variant="outline">Connect</Button>
                  </div>

                  <div className="flex items-center justify-between border p-4 rounded-md">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gray-100 p-2 rounded-md">
                        <img
                          src="https://cdn.cdnlogo.com/logos/m/25/microsoft-outlook.svg"
                          alt="Outlook"
                          className="w-8 h-8"
                        />
                      </div>
                      <div>
                        <p className="font-medium">Microsoft Outlook</p>
                        <p className="text-sm text-muted-foreground">
                          Sync emails and calendar events
                        </p>
                      </div>
                    </div>
                    <Button variant="outline">Connect</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customization" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Customization</CardTitle>
                <CardDescription>
                  Customize the appearance and branding of your tenant
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tenant Logo</Label>
                    <div className="flex items-center gap-4">
                      <div className="h-20 w-20 border rounded-md flex items-center justify-center bg-gray-50">
                        <span className="text-gray-400">No logo</span>
                      </div>
                      <Button variant="outline">Upload Logo</Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Primary Color</Label>
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-md bg-jobmojo-primary" />
                      <Input type="color" defaultValue="#9b87f5" className="w-20 h-10" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Email Template</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border rounded-md p-4 flex flex-col items-center justify-center cursor-pointer hover:border-primary">
                        <div className="h-24 w-full bg-gray-100 mb-2 rounded"></div>
                        <span>Minimal</span>
                      </div>
                      <div className="border rounded-md p-4 flex flex-col items-center justify-center cursor-pointer hover:border-primary">
                        <div className="h-24 w-full bg-gray-100 mb-2 rounded"></div>
                        <span>Corporate</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    toast({
                      title: "Customization settings saved",
                      description: "Your branding preferences have been updated",
                    });
                  }}
                >
                  Save Customization
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default TenantAdminSettings;
