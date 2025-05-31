
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AIAgent } from '@/types/ai';

export const useAIAgents = (tenantId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const agentsQuery = useQuery({
    queryKey: ['ai-agents', tenantId],
    queryFn: async (): Promise<AIAgent[]> => {
      let query = supabase
        .from('ai_agents')
        .select('*')
        .order('name', { ascending: true });

      if (tenantId) {
        query = query.eq('tenant_id', tenantId);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      return (data || []).map(agent => ({
        ...agent,
        model_config: (agent.model_config as Record<string, any>) || {},
        performance_metrics: (agent.performance_metrics as Record<string, any>) || {}
      }));
    }
  });

  const createAgentMutation = useMutation({
    mutationFn: async (agentData: Omit<AIAgent, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('ai_agents')
        .insert([{
          ...agentData,
          model_config: agentData.model_config as any,
          performance_metrics: agentData.performance_metrics as any
        }])
        .select()
        .single();

      if (error) throw error;
      return {
        ...data,
        model_config: (data.model_config as Record<string, any>) || {},
        performance_metrics: (data.performance_metrics as Record<string, any>) || {}
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-agents'] });
      toast({
        title: "Success",
        description: "AI agent created successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create AI agent",
        variant: "destructive"
      });
    }
  });

  const updateAgentMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<AIAgent> }) => {
      const updateData = {
        ...updates,
        ...(updates.model_config && { model_config: updates.model_config as any }),
        ...(updates.performance_metrics && { performance_metrics: updates.performance_metrics as any })
      };
      
      const { data, error } = await supabase
        .from('ai_agents')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return {
        ...data,
        model_config: (data.model_config as Record<string, any>) || {},
        performance_metrics: (data.performance_metrics as Record<string, any>) || {}
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-agents'] });
      toast({
        title: "Success",
        description: "AI agent updated successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update AI agent",
        variant: "destructive"
      });
    }
  });

  const deleteAgentMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('ai_agents')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-agents'] });
      toast({
        title: "Success",
        description: "AI agent deleted successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete AI agent",
        variant: "destructive"
      });
    }
  });

  const toggleAgentStatusMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { data, error } = await supabase
        .from('ai_agents')
        .update({ is_active: isActive })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return {
        ...data,
        model_config: (data.model_config as Record<string, any>) || {},
        performance_metrics: (data.performance_metrics as Record<string, any>) || {}
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-agents'] });
      toast({
        title: "Success",
        description: "AI agent status updated successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update AI agent status",
        variant: "destructive"
      });
    }
  });

  return {
    agents: agentsQuery.data || [],
    isLoading: agentsQuery.isLoading,
    error: agentsQuery.error,
    createAgent: createAgentMutation,
    updateAgent: updateAgentMutation,
    deleteAgent: deleteAgentMutation,
    toggleAgentStatus: toggleAgentStatusMutation
  };
};
