
import React, { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Globe, MessageCircle, Send, Database } from "lucide-react";

// Import component tabs
import GeneralSettings from "./settings/GeneralSettings";
import SocialMediaSettings from "./settings/SocialMediaSettings";
import CommunicationSettings from "./settings/CommunicationSettings";
import OutreachSettings from "./settings/OutreachSettings";
import ApiSettings from "./settings/ApiSettings";
import SetupWizard from "./settings/setup-wizard/SetupWizard";

const TenantAdminSettings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  const [showSetupWizard, setShowSetupWizard] = useState(false);

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
            <div className="flex space-x-2">
              <div className="bg-jobmojo-primary text-white px-4 py-2 rounded-md">
                {tenantData.tenants.name}
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowSetupWizard(true)}
              >
                Setup Wizard
              </Button>
            </div>
          )}
        </div>

        {/* Setup Wizard Component */}
        <SetupWizard 
          open={showSetupWizard} 
          onOpenChange={setShowSetupWizard}
          tenantData={tenantData}
        />

        <div className="bg-white rounded-lg shadow-sm">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b">
              <TabsList className="flex w-full justify-between rounded-none bg-transparent p-0">
                <TabsTrigger 
                  value="general" 
                  className="flex items-center gap-2 rounded-none border-b-2 border-transparent px-6 py-3 text-sm font-medium text-muted-foreground hover:text-primary data-[state=active]:border-b-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
                >
                  <Settings className="h-4 w-4" />
                  General
                </TabsTrigger>
                <TabsTrigger 
                  value="social" 
                  className="flex items-center gap-2 rounded-none border-b-2 border-transparent px-6 py-3 text-sm font-medium text-muted-foreground hover:text-primary data-[state=active]:border-b-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
                >
                  <Globe className="h-4 w-4" />
                  Social Media
                </TabsTrigger>
                <TabsTrigger 
                  value="communication" 
                  className="flex items-center gap-2 rounded-none border-b-2 border-transparent px-6 py-3 text-sm font-medium text-muted-foreground hover:text-primary data-[state=active]:border-b-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
                >
                  <MessageCircle className="h-4 w-4" />
                  Communication
                </TabsTrigger>
                <TabsTrigger 
                  value="outreach" 
                  className="flex items-center gap-2 rounded-none border-b-2 border-transparent px-6 py-3 text-sm font-medium text-muted-foreground hover:text-primary data-[state=active]:border-b-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
                >
                  <Send className="h-4 w-4" />
                  Outreach
                </TabsTrigger>
                <TabsTrigger 
                  value="api" 
                  className="flex items-center gap-2 rounded-none border-b-2 border-transparent px-6 py-3 text-sm font-medium text-muted-foreground hover:text-primary data-[state=active]:border-b-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
                >
                  <Database className="h-4 w-4" />
                  API
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-4">
              <TabsContent value="general" className="mt-0 pt-4">
                <GeneralSettings />
              </TabsContent>

              <TabsContent value="social" className="mt-0 pt-4">
                <SocialMediaSettings />
              </TabsContent>
              
              <TabsContent value="communication" className="mt-0 pt-4">
                <CommunicationSettings />
              </TabsContent>

              <TabsContent value="outreach" className="mt-0 pt-4">
                <OutreachSettings />
              </TabsContent>

              <TabsContent value="api" className="mt-0 pt-4">
                <ApiSettings />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
};

export default TenantAdminSettings;
