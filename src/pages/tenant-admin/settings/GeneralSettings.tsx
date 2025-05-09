
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PenSquare } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const GeneralSettings = () => {
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

  return (
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
  );
};

export default GeneralSettings;
