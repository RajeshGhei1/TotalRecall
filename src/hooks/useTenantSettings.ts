
import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Define valid table names based on your Supabase schema
type ValidTableName = 'tenants' | 'tenant_settings' | 'tenant_communication' | 'tenant_social_media' | 
                     'tenant_outreach' | 'tenant_api_settings';

export function useTenantSettings<T extends Record<string, any>>(
  tableName: ValidTableName,
  defaultValue: T,
  keyField: string = "id"
) {
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
  const [data, setData] = useState<T>(defaultValue);
  const queryClient = useQueryClient();

  // Fetch tenants query
  const { data: tenants, isLoading: isLoadingTenants } = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenants')
        .select('id, name')
        .order('name', { ascending: true });
        
      if (error) throw error;
      return data;
    }
  });

  // Fetch tenant settings query
  const { isLoading: isLoadingSettings } = useQuery({
    queryKey: [tableName, selectedTenantId],
    queryFn: async () => {
      if (!selectedTenantId) return null;
      
      // Use type assertion to handle the dynamic table name
      const { data, error } = await (supabase
        .from(tableName as unknown)
        .select('*')
        .eq('tenant_id', selectedTenantId)
        .maybeSingle());

      if (error) throw error;
      return data;
    },
    enabled: !!selectedTenantId,
    meta: {
      onSuccess: (fetchedData: any) => {
        if (fetchedData) {
          setData({...defaultValue, ...fetchedData});
        } else {
          setData({...defaultValue, tenant_id: selectedTenantId});
        }
      }
    }
  });

  // Update settings mutation
  const updateSettings = useMutation({
    mutationFn: async (updateData: Partial<T>) => {
      if (!selectedTenantId) throw new Error("No tenant selected");
      
      const dataToUpdate = { 
        ...updateData, 
        tenant_id: selectedTenantId
      };
      
      // Check if record exists
      const { data: existingData } = await (supabase
        .from(tableName as unknown)
        .select(keyField)
        .eq('tenant_id', selectedTenantId)
        .maybeSingle());
      
      let result;
      
      if (existingData) {
        // Update
        const { data, error } = await (supabase
          .from(tableName as unknown)
          .update(dataToUpdate as unknown)
          .eq('tenant_id', selectedTenantId)
          .select());
        
        if (error) throw error;
        result = data;
      } else {
        // Insert
        const { data, error } = await (supabase
          .from(tableName as unknown)
          .insert(dataToUpdate as unknown)
          .select());
        
        if (error) throw error;
        result = data;
      }
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [tableName, selectedTenantId]
      });
      toast({
        title: "Settings saved",
        description: "Your changes have been saved successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to save settings: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const updateField = useCallback((field: keyof T, value: unknown) => {
    setData(prev => ({...prev, [field]: value}));
  }, []);

  const saveSettings = useCallback(() => {
    if (!selectedTenantId) {
      toast({
        title: "No tenant selected",
        description: "Please select a tenant first",
        variant: "destructive"
      });
      return;
    }
    
    updateSettings.mutate(data);
  }, [data, selectedTenantId, updateSettings]);

  return {
    tenants,
    isLoadingTenants,
    selectedTenantId,
    setSelectedTenantId,
    data,
    updateField,
    isLoading: isLoadingSettings,
    isUpdating: updateSettings.isPending,
    saveSettings
  };
}
