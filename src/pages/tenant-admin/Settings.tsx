
import React, { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { 
  Settings, 
  Bell, 
  Mail, 
  Shield, 
  Palette, 
  Database 
} from "lucide-react";
import { useCustomFields } from "@/hooks/useCustomFields";

const TenantAdminSettings = () => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState("general");
  const [tenantName, setTenantName] = useState("");
  const [tenantDescription, setTenantDescription] = useState("");

  // Fetch tenant information for the current user
  const { data: tenantData, isLoading } = useQuery({
    queryKey: ['currentTenantSettings'],
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
      
      // Set initial form values
      setTenantName(data.tenants.name);
      setTenantDescription(data.tenants.description || "");
      
      return data;
    },
    enabled: !!user,
  });

  const { customFields } = useCustomFields(tenantData?.tenant_id);

  // Update tenant settings
  const updateTenantMutation = useMutation({
    mutationFn: async () => {
      if (!tenantData?.tenant_id) return;
      
      const { error } = await supabase
        .from('tenants')
        .update({
          name: tenantName.trim(),
          description: tenantDescription.trim() || null
        })
        .eq('id', tenantData.tenant_id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Settings updated",
        description: "Tenant settings have been updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating settings",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  });

  const handleSaveSettings = () => {
    if (!tenantName.trim()) {
      toast({
        title: "Validation error",
        description: "Tenant name is required",
        variant: "destructive",
      });
      return;
    }
    
    updateTenantMutation.mutate();
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Tenant Admin Settings</h1>
          <div className="flex items-center justify-center h-64">
            <p>Loading settings...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!tenantData) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Tenant Admin Settings</h1>
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">No tenant data available</p>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Tenant Admin Settings</h1>
          {tenantData?.tenants?.name && (
            <div className="bg-jobmojo-primary text-white px-4 py-2 rounded-md">
              {tenantData.tenants.name}
            </div>
          )}
        </div>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid grid-cols-5 w-full max-w-3xl mb-4">
            <TabsTrigger value="general" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" /> General
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center">
              <Bell className="mr-2 h-4 w-4" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="branding" className="flex items-center">
              <Palette className="mr-2 h-4 w-4" /> Branding
            </TabsTrigger>
            <TabsTrigger value="customFields" className="flex items-center">
              <Database className="mr-2 h-4 w-4" /> Custom Fields
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center">
              <Shield className="mr-2 h-4 w-4" /> Security
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Basic settings for your tenant organization.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <label htmlFor="tenant-name" className="text-sm font-medium">
                    Organization Name
                  </label>
                  <Input
                    id="tenant-name"
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="tenant-description" className="text-sm font-medium">
                    Organization Description
                  </label>
                  <Input
                    id="tenant-description"
                    value={tenantDescription}
                    onChange={(e) => setTenantDescription(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="tenant-timezone" className="text-sm font-medium">
                    Default Timezone
                  </label>
                  <select 
                    id="tenant-timezone"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  </select>
                </div>
                
                <div className="pt-4">
                  <Button onClick={handleSaveSettings} disabled={updateTenantMutation.isPending}>
                    {updateTenantMutation.isPending ? "Saving..." : "Save Settings"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure when and how you receive notifications.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive email notifications for important updates.
                      </p>
                    </div>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">New Talent Alerts</h3>
                      <p className="text-sm text-muted-foreground">
                        Get notified when new talent is added to the platform.
                      </p>
                    </div>
                    <Switch id="talent-notifications" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Interview Reminders</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive reminders for upcoming interviews.
                      </p>
                    </div>
                    <Switch id="interview-notifications" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Daily Digest</h3>
                      <p className="text-sm text-muted-foreground">
                        Get a daily summary of all activities.
                      </p>
                    </div>
                    <Switch id="digest-notifications" />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button>Save Notification Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="branding">
            <Card>
              <CardHeader>
                <CardTitle>Branding Settings</CardTitle>
                <CardDescription>
                  Customize the appearance of your tenant.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Logo</label>
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                      <p className="text-sm text-muted-foreground">No logo</p>
                    </div>
                    <Button variant="outline">Upload Logo</Button>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Primary Color</label>
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-md bg-blue-500"></div>
                    <Input type="text" value="#3B82F6" className="w-40" />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Secondary Color</label>
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-md bg-purple-500"></div>
                    <Input type="text" value="#8B5CF6" className="w-40" />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button>Save Branding</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="customFields">
            <Card>
              <CardHeader>
                <CardTitle>Custom Fields</CardTitle>
                <CardDescription>
                  Manage custom fields for talent, jobs, and other entities.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Custom Fields Configuration</h3>
                    <Button>
                      <Database className="mr-2 h-4 w-4" /> Add Custom Field
                    </Button>
                  </div>
                  
                  {customFields?.length ? (
                    <div className="border rounded-md divide-y">
                      {customFields.map((field) => (
                        <div key={field.id} className="p-4 flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{field.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Type: {field.field_type} | Key: {field.field_key}
                            </p>
                            {field.description && (
                              <p className="text-xs text-muted-foreground mt-1">{field.description}</p>
                            )}
                          </div>
                          <div>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-muted/50 p-8 text-center rounded-md">
                      <Database className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <h3 className="font-medium mb-1">No Custom Fields</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        You haven't created any custom fields yet.
                      </p>
                      <Button>Create Your First Custom Field</Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage security settings for your tenant organization.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-muted-foreground">
                      Require users to enable 2FA for added security.
                    </p>
                  </div>
                  <Switch id="require-2fa" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Password Policy</h3>
                    <p className="text-sm text-muted-foreground">
                      Require strong passwords with special characters and numbers.
                    </p>
                  </div>
                  <Switch id="strong-passwords" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Account Lockout</h3>
                    <p className="text-sm text-muted-foreground">
                      Lock accounts after 5 failed login attempts.
                    </p>
                  </div>
                  <Switch id="account-lockout" defaultChecked />
                </div>
                
                <div className="grid gap-2 pt-4">
                  <label className="text-sm font-medium">Session Timeout (minutes)</label>
                  <Input type="number" min={5} max={240} defaultValue={60} className="w-32" />
                  <p className="text-xs text-muted-foreground">
                    Logout users after a period of inactivity.
                  </p>
                </div>
                
                <div className="pt-4">
                  <Button>Save Security Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default TenantAdminSettings;
