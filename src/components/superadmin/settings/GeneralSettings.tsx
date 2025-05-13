
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PenSquare, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import TenantSelector from "./TenantSelector";

const GeneralSettings = () => {
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<{name: boolean, description: boolean}>({
    name: false,
    description: false
  });
  const [tenantData, setTenantData] = useState<{
    id: string;
    name: string;
    description: string | null;
  }>({
    id: '',
    name: '',
    description: ''
  });

  const queryClient = useQueryClient();

  // Fetch tenant information when a tenant is selected
  const { data: fetchedTenantData, isLoading } = useQuery({
    queryKey: ['tenantDetails', selectedTenantId],
    queryFn: async () => {
      if (!selectedTenantId) return null;
      
      const { data, error } = await supabase
        .from('tenants')
        .select('id, name, description')
        .eq('id', selectedTenantId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!selectedTenantId,
    meta: {
      onSuccess: (data: any) => {
        if (data) {
          setTenantData({
            id: data.id,
            name: data.name,
            description: data.description || ''
          });
        }
      }
    }
  });

  // Update tenant mutation
  const updateTenant = useMutation({
    mutationFn: async (data: { field: string, value: string }) => {
      if (!selectedTenantId) throw new Error("No tenant selected");
      
      const { data: result, error } = await supabase
        .from('tenants')
        .update({ [data.field]: data.value })
        .eq('id', selectedTenantId)
        .select();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tenantDetails', selectedTenantId]
      });
      toast({
        title: "Settings saved",
        description: "Tenant settings have been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update tenant settings: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const handleSaveName = () => {
    updateTenant.mutate({
      field: 'name',
      value: tenantData.name
    });
    setIsEditing(prev => ({ ...prev, name: false }));
  };

  const handleSaveDescription = () => {
    updateTenant.mutate({
      field: 'description',
      value: tenantData.description || ''
    });
    setIsEditing(prev => ({ ...prev, description: false }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>
          Manage tenant's general settings and information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <TenantSelector 
          selectedTenantId={selectedTenantId}
          onTenantChange={(tenantId) => setSelectedTenantId(tenantId)}
        />

        {isLoading && selectedTenantId ? (
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded animate-pulse" />
            <div className="h-24 bg-gray-200 rounded animate-pulse" />
          </div>
        ) : selectedTenantId ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tenant-name">Tenant Name</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="tenant-name"
                  value={tenantData.name}
                  onChange={(e) => setTenantData({...tenantData, name: e.target.value})}
                  disabled={!isEditing.name}
                  className="flex-1"
                />
                {isEditing.name ? (
                  <Button onClick={handleSaveName} size="sm" className="flex-none">
                    <Save className="h-4 w-4 mr-2" /> Save
                  </Button>
                ) : (
                  <Button onClick={() => setIsEditing({...isEditing, name: true})} size="sm" className="flex-none">
                    <PenSquare className="h-4 w-4 mr-2" /> Edit
                  </Button>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tenant-description">Description</Label>
              <div className="flex items-start gap-2">
                <Textarea
                  id="tenant-description"
                  rows={4}
                  value={tenantData.description || ''}
                  onChange={(e) => setTenantData({...tenantData, description: e.target.value})}
                  disabled={!isEditing.description}
                  className="flex-1"
                />
                {isEditing.description ? (
                  <Button onClick={handleSaveDescription} size="sm" className="flex-none">
                    <Save className="h-4 w-4 mr-2" /> Save
                  </Button>
                ) : (
                  <Button onClick={() => setIsEditing({...isEditing, description: true})} size="sm" className="flex-none">
                    <PenSquare className="h-4 w-4 mr-2" /> Edit
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-muted/50 p-6 text-center rounded-md">
            <p className="text-muted-foreground">Select a tenant to manage its settings</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GeneralSettings;
