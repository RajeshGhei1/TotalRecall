
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TalentList from "@/components/talent/TalentList";
import TalentForm from "@/components/talent/TalentForm";
import TalentDetail from "@/components/talent/TalentDetail";
import { CustomFieldsManager } from "@/components/customFields";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const TenantAdminTalent = () => {
  const { action, id } = useParams(); 
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("talents");

  // Fetch tenant information for the current user
  const { data: tenantData } = useQuery({
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
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Determine which view to render based on URL params
  const renderContent = () => {
    if (action === "add") {
      return (
        <div className="space-y-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-2" 
              onClick={() => navigate('/tenant-admin/talent')}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Talents
            </Button>
          </div>
          <h2 className="text-2xl font-bold">Add New Talent</h2>
          <TalentForm />
        </div>
      );
    } else if (action === "edit" && id) {
      return (
        <div className="space-y-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-2" 
              onClick={() => navigate('/tenant-admin/talent')}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Talents
            </Button>
          </div>
          <h2 className="text-2xl font-bold">Edit Talent</h2>
          <TalentForm talentId={id} />
        </div>
      );
    } else if (action === "view" && id) {
      return (
        <div className="space-y-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-2" 
              onClick={() => navigate('/tenant-admin/talent')}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Talents
            </Button>
          </div>
          <TalentDetail talentId={id} />
        </div>
      );
    } else {
      // Default view - tabs for Talents list and Custom Fields management
      return (
        <Card>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-[400px] mx-4 mt-4">
              <TabsTrigger value="talents">Talent Pool</TabsTrigger>
              <TabsTrigger value="custom-fields">Custom Fields</TabsTrigger>
            </TabsList>
            <CardContent className="pt-6">
              <TabsContent value="talents" className="mt-0">
                <TalentList />
              </TabsContent>
              <TabsContent value="custom-fields" className="mt-0">
                {tenantData?.tenant_id && (
                  <CustomFieldsManager tenantId={tenantData.tenant_id} />
                )}
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      );
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Talent Management</h1>
          {tenantData?.tenants?.name && (
            <div className="bg-jobmojo-primary text-white px-4 py-2 rounded-md">
              {tenantData.tenants.name}
            </div>
          )}
        </div>
        
        {renderContent()}
      </div>
    </AdminLayout>
  );
};

export default TenantAdminTalent;
