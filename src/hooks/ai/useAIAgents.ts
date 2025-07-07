import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useTenantContext } from '@/contexts/TenantContext';
import { 
  aiAgentService, 
  AIAgent, 
  CreateAIAgentRequest, 
  UpdateAIAgentRequest,
  AIAgentActivityLog 
} from '@/services/ai/aiAgentService';

export const useAIAgents = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { selectedTenantId } = useTenantContext();

  // Get all agents
  const agentsQuery = useQuery({
    queryKey: ['ai-agents', selectedTenantId],
    queryFn: () => aiAgentService.getAgents(selectedTenantId),
    enabled: true // Always enabled to show global agents
  });

  // Create agent mutation
  const createAgentMutation = useMutation({
    mutationFn: (agentData: CreateAIAgentRequest) => 
      aiAgentService.createAgent(agentData, selectedTenantId || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-agents', selectedTenantId] });
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

  // Update agent mutation
  const updateAgentMutation = useMutation({
    mutationFn: ({ agentId, updates }: { agentId: string; updates: UpdateAIAgentRequest }) =>
      aiAgentService.updateAgent(agentId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-agents', selectedTenantId] });
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

  // Delete agent mutation
  const deleteAgentMutation = useMutation({
    mutationFn: (agentId: string) => aiAgentService.deleteAgent(agentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-agents', selectedTenantId] });
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

  // Execute agent mutation
  const executeAgentMutation = useMutation({
    mutationFn: ({ agentId, input }: { agentId: string; input: any }) =>
      aiAgentService.executeAgent(agentId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-agents', selectedTenantId] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to execute AI agent",
        variant: "destructive"
      });
    }
  });

  return {
    // Data
    agents: agentsQuery.data || [],
    isLoading: agentsQuery.isLoading,
    error: agentsQuery.error,
    
    // Mutations
    createAgent: createAgentMutation,
    updateAgent: updateAgentMutation,
    deleteAgent: deleteAgentMutation,
    executeAgent: executeAgentMutation,
    
    // Utilities
    refetch: agentsQuery.refetch
  };
};

export const useAIAgent = (agentId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get specific agent
  const agentQuery = useQuery({
    queryKey: ['ai-agent', agentId],
    queryFn: () => aiAgentService.getAgent(agentId),
    enabled: !!agentId
  });

  // Get agent activity logs
  const activityLogsQuery = useQuery({
    queryKey: ['ai-agent-logs', agentId],
    queryFn: () => aiAgentService.getAgentActivityLogs(agentId),
    enabled: !!agentId
  });

  // Get agent performance metrics
  const performanceMetricsQuery = useQuery({
    queryKey: ['ai-agent-metrics', agentId],
    queryFn: () => aiAgentService.getAgentPerformanceMetrics(agentId),
    enabled: !!agentId
  });

  return {
    // Data
    agent: agentQuery.data,
    activityLogs: activityLogsQuery.data || [],
    performanceMetrics: performanceMetricsQuery.data,
    
    // Loading states
    isLoading: agentQuery.isLoading,
    isLoadingLogs: activityLogsQuery.isLoading,
    isLoadingMetrics: performanceMetricsQuery.isLoading,
    
    // Errors
    error: agentQuery.error,
    logsError: activityLogsQuery.error,
    metricsError: performanceMetricsQuery.error,
    
    // Utilities
    refetch: agentQuery.refetch,
    refetchLogs: activityLogsQuery.refetch,
    refetchMetrics: performanceMetricsQuery.refetch
  };
};

export const useAIAgentActivity = (agentId: string) => {
  const { toast } = useToast();

  // Log activity mutation
  const logActivityMutation = useMutation({
    mutationFn: (activityData: Omit<AIAgentActivityLog, 'id' | 'created_at'>) =>
      aiAgentService.logActivity(activityData),
    onError: (error: any) => {
      console.error('Failed to log activity:', error);
      // Don't show toast for logging failures as they're not critical
    }
  });

  return {
    logActivity: logActivityMutation
  };
};
