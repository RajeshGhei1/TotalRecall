
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useModuleEnablement = (tenantId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const enableModuleViaOverride = useMutation({
    mutationFn: async ({ 
      moduleId, 
      expiresAt 
    }: { 
      moduleId: string; 
      expiresAt?: string;
    }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('tenant_module_assignments')
        .insert([{
          tenant_id: tenantId,
          module_id: moduleId,
          is_enabled: true,
          assigned_by: user.user.id,
          expires_at: expiresAt
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-modules', tenantId] });
      queryClient.invalidateQueries({ queryKey: ['module-access-stats', tenantId] });
      queryClient.invalidateQueries({ queryKey: ['unified-module-access', tenantId] });
      
      toast({
        title: "Module Enabled",
        description: "Module has been enabled via emergency override."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to enable module",
        variant: "destructive"
      });
    }
  });

  const disableModuleOverride = useMutation({
    mutationFn: async (assignmentId: string) => {
      const { error } = await supabase
        .from('tenant_module_assignments')
        .update({ is_enabled: false })
        .eq('id', assignmentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-modules', tenantId] });
      queryClient.invalidateQueries({ queryKey: ['module-access-stats', tenantId] });
      queryClient.invalidateQueries({ queryKey: ['unified-module-access', tenantId] });
      
      toast({
        title: "Module Disabled",
        description: "Module override has been disabled."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to disable module",
        variant: "destructive"
      });
    }
  });

  return {
    enableModuleViaOverride: enableModuleViaOverride.mutateAsync,
    disableModuleOverride: disableModuleOverride.mutateAsync,
    isEnabling: enableModuleViaOverride.isPending,
    isDisabling: disableModuleOverride.isPending
  };
};
