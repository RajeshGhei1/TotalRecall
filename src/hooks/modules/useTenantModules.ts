
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Json } from '@/integrations/supabase/types';

export interface TenantModuleAssignment {
  id: string;
  tenant_id: string;
  module_id: string;
  is_enabled: boolean;
  custom_limits?: Json;
  assigned_at: string;
  assigned_by: string;
  expires_at?: string;
  module?: {
    name: string;
    category: string;
    description?: string;
  };
  tenant?: {
    name: string;
  };
}

export const useTenantModules = (tenantId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const tenantModulesQuery = useQuery({
    queryKey: ['tenant-modules', tenantId],
    queryFn: async (): Promise<TenantModuleAssignment[]> => {
      let query = supabase
        .from('tenant_module_assignments')
        .select(`
          *,
          module:system_modules(name, category, description),
          tenant:tenants(name)
        `);

      if (tenantId) {
        query = query.eq('tenant_id', tenantId);
      }

      const { data, error } = await query.order('assigned_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: Boolean(tenantId) || !tenantId // Enable for all tenants if no specific tenant
  });

  const assignModuleMutation = useMutation({
    mutationFn: async (assignment: {
      tenant_id: string;
      module_id: string;
      is_enabled?: boolean;
      custom_limits?: Json;
      expires_at?: string;
    }) => {
      const { data, error } = await supabase
        .from('tenant_module_assignments')
        .insert([{
          ...assignment,
          assigned_by: (await supabase.auth.getUser()).data.user?.id || '',
          is_enabled: assignment.is_enabled ?? true
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-modules'] });
      toast({
        title: "Success",
        description: "Module assigned successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to assign module",
        variant: "destructive"
      });
    }
  });

  const updateAssignmentMutation = useMutation({
    mutationFn: async ({ id, updates }: { 
      id: string; 
      updates: Partial<TenantModuleAssignment> 
    }) => {
      const { data, error } = await supabase
        .from('tenant_module_assignments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-modules'] });
      toast({
        title: "Success",
        description: "Module assignment updated successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update assignment",
        variant: "destructive"
      });
    }
  });

  const removeAssignmentMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tenant_module_assignments')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-modules'] });
      toast({
        title: "Success",
        description: "Module assignment removed successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove assignment",
        variant: "destructive"
      });
    }
  });

  return {
    data: tenantModulesQuery.data || [],
    isLoading: tenantModulesQuery.isLoading,
    error: tenantModulesQuery.error,
    assignModule: assignModuleMutation,
    updateAssignment: updateAssignmentMutation,
    removeAssignment: removeAssignmentMutation
  };
};
