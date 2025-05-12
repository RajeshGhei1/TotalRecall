
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomFieldsManager } from "@/components/customFields";
import { Database } from "lucide-react";

const CustomFieldsSettings = () => {
  const { user } = useAuth();

  // Fetch tenant information for the current user
  const { data: tenantData, isLoading } = useQuery({
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

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-jobmojo-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!tenantData?.tenant_id) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            No tenant information found. Please contact your administrator.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Custom Fields
        </CardTitle>
        <CardDescription>
          Create and manage custom fields for your organization. These fields will appear in various forms throughout the application.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CustomFieldsManager tenantId={tenantData.tenant_id} />
      </CardContent>
    </Card>
  );
};

export default CustomFieldsSettings;
