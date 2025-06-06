
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

  // Map module names to their respective table names
  const getTableName = (moduleName: string) => {
    const tableMap: Record<string, string> = {
      'social_media_integration': 'tenant_social_media_connections',
      'communication_platforms': 'tenant_communication_connections',
      'video_conferencing': 'tenant_video_connections',
      'billing_integrations': 'tenant_billing_connections',
      'api_connectors': 'tenant_api_connections'
    };
    return tableMap[moduleName];
  };

  const { data: connections, isLoading } = useQuery({
    queryKey: ['module-connections', moduleName, tenantId],
    queryFn: async (): Promise<ModuleConnection[]> => {
      const tableName = getTableName(moduleName);
      if (!tableName || !tenantId) return [];

      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

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
      const tableName = getTableName(moduleName);
      if (!tableName || !tenantId) throw new Error('Invalid module or tenant');

      const { data, error } = await supabase
        .from(tableName)
        .insert([{
          tenant_id: tenantId,
          ...connectionData
        }])
        .select()
        .single();

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
      const tableName = getTableName(moduleName);
      if (!tableName) throw new Error('Invalid module');

      const { data, error } = await supabase
        .from(tableName)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

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
      const tableName = getTableName(moduleName);
      if (!tableName) throw new Error('Invalid module');

      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

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
