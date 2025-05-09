
import React from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const TenantAdminTalent = () => {
  const { user } = useAuth();

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
        
        <Card>
          <CardHeader>
            <CardTitle>Talent Pool</CardTitle>
            <CardDescription>Manage your talent database and candidates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end mb-4">
              <Button className="flex items-center">
                <Users className="mr-2 h-4 w-4" /> Add New Talent
              </Button>
            </div>
            <p className="text-muted-foreground">No talents found. Add your first talent to get started.</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default TenantAdminTalent;
