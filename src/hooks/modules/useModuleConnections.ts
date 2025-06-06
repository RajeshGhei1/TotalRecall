
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ModuleConnection {
  id: string;
  tenant_id: string;
  platform: string;
  connection_config: Record<string, any>;
  is_active: boolean;
  connected_at: string;
  expires_at?: string;
}

export const useModuleConnections = (moduleName: string, tenantId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: connections, isLoading } = useQuery({
    queryKey: ['module-connections', moduleName, tenantId],
    queryFn: async (): Promise<ModuleConnection[]> => {
      if (!tenantId) return [];

      let data: any[] = [];
      let error: any = null;

      // Use explicit table queries based on module name
      if (moduleName === 'social_media_integration') {
        const result = await supabase
          .from('tenant_social_media_connections')
          .select('*')
          .eq('tenant_id', tenantId)
          .order('created_at', { ascending: false });
        data = result.data || [];
        error = result.error;
      } else if (moduleName === 'communication_platforms') {
        const result = await supabase
          .from('tenant_communication_connections')
          .select('*')
          .eq('tenant_id', tenantId)
          .order('created_at', { ascending: false });
        data = result.data || [];
        error = result.error;
      } else if (moduleName === 'video_conferencing') {
        const result = await supabase
          .from('tenant_video_connections')
          .select('*')
          .eq('tenant_id', tenantId)
          .order('created_at', { ascending: false });
        data = result.data || [];
        error = result.error;
      } else if (moduleName === 'billing_integrations') {
        const result = await supabase
          .from('tenant_billing_connections')
          .select('*')
          .eq('tenant_id', tenantId)
          .order('created_at', { ascending: false });
        data = result.data || [];
        error = result.error;
      } else if (moduleName === 'api_connectors') {
        const result = await supabase
          .from('tenant_api_connections')
          .select('*')
          .eq('tenant_id', tenantId)
          .order('created_at', { ascending: false });
        data = result.data || [];
        error = result.error;
      }

      if (error) throw error;
      return data || [];
    },
    enabled: !!moduleName && !!tenantId
  });

  const createConnectionMutation = useMutation({
    mutationFn: async (connectionData: {
      platform: string;
      connection_config: Record<string, any>;
      expires_at?: string;
    }) => {
      if (!tenantId) throw new Error('Tenant ID required');

      let data: any = null;
      let error: any = null;

      const baseData = {
        tenant_id: tenantId,
        ...connectionData
      };

      if (moduleName === 'social_media_integration') {
        const result = await supabase
          .from('tenant_social_media_connections')
          .insert([baseData])
          .select()
          .single();
        data = result.data;
        error = result.error;
      } else if (moduleName === 'communication_platforms') {
        const result = await supabase
          .from('tenant_communication_connections')
          .insert([baseData])
          .select()
          .single();
        data = result.data;
        error = result.error;
      } else if (moduleName === 'video_conferencing') {
        const result = await supabase
          .from('tenant_video_connections')
          .insert([baseData])
          .select()
          .single();
        data = result.data;
        error = result.error;
      } else if (moduleName === 'billing_integrations') {
        const result = await supabase
          .from('tenant_billing_connections')
          .insert([baseData])
          .select()
          .single();
        data = result.data;
        error = result.error;
      } else if (moduleName === 'api_connectors') {
        const result = await supabase
          .from('tenant_api_connections')
          .insert([{
            ...baseData,
            connection_name: connectionData.platform,
            api_endpoint: 'https://api.example.com',
            authentication_config: connectionData.connection_config
          }])
          .select()
          .single();
        data = result.data;
        error = result.error;
      }

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['module-connections', moduleName, tenantId] });
      toast({
        title: "Connection Created",
        description: "Module connection has been established successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create connection",
        variant: "destructive"
      });
    }
  });

  const updateConnectionMutation = useMutation({
    mutationFn: async ({ id, updates }: { 
      id: string; 
      updates: Partial<ModuleConnection> 
    }) => {
      let data: any = null;
      let error: any = null;

      if (moduleName === 'social_media_integration') {
        const result = await supabase
          .from('tenant_social_media_connections')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        data = result.data;
        error = result.error;
      } else if (moduleName === 'communication_platforms') {
        const result = await supabase
          .from('tenant_communication_connections')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        data = result.data;
        error = result.error;
      } else if (moduleName === 'video_conferencing') {
        const result = await supabase
          .from('tenant_video_connections')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        data = result.data;
        error = result.error;
      } else if (moduleName === 'billing_integrations') {
        const result = await supabase
          .from('tenant_billing_connections')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        data = result.data;
        error = result.error;
      } else if (moduleName === 'api_connectors') {
        const result = await supabase
          .from('tenant_api_connections')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        data = result.data;
        error = result.error;
      }

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['module-connections', moduleName, tenantId] });
      toast({
        title: "Connection Updated",
        description: "Module connection has been updated successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update connection",
        variant: "destructive"
      });
    }
  });

  const deleteConnectionMutation = useMutation({
    mutationFn: async (id: string) => {
      let error: any = null;

      if (moduleName === 'social_media_integration') {
        const result = await supabase
          .from('tenant_social_media_connections')
          .delete()
          .eq('id', id);
        error = result.error;
      } else if (moduleName === 'communication_platforms') {
        const result = await supabase
          .from('tenant_communication_connections')
          .delete()
          .eq('id', id);
        error = result.error;
      } else if (moduleName === 'video_conferencing') {
        const result = await supabase
          .from('tenant_video_connections')
          .delete()
          .eq('id', id);
        error = result.error;
      } else if (moduleName === 'billing_integrations') {
        const result = await supabase
          .from('tenant_billing_connections')
          .delete()
          .eq('id', id);
        error = result.error;
      } else if (moduleName === 'api_connectors') {
        const result = await supabase
          .from('tenant_api_connections')
          .delete()
          .eq('id', id);
        error = result.error;
      }

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['module-connections', moduleName, tenantId] });
      toast({
        title: "Connection Deleted",
        description: "Module connection has been removed successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete connection",
        variant: "destructive"
      });
    }
  });

  return {
    connections: connections || [],
    isLoading,
    createConnection: createConnectionMutation.mutateAsync,
    updateConnection: updateConnectionMutation.mutateAsync,
    deleteConnection: deleteConnectionMutation.mutateAsync,
    isCreating: createConnectionMutation.isPending,
    isUpdating: updateConnectionMutation.isPending,
    isDeleting: deleteConnectionMutation.isPending
  };
};
