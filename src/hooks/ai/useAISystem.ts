
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aiSystemInitializer } from '@/services/ai/core/aiSystemInitializer';
import { aiMetricsCollector } from '@/services/ai/core/aiMetricsCollector';
import { aiAgentManager } from '@/services/ai/core/aiAgentManager';
import { aiDecisionRecorder } from '@/services/ai/core/aiDecisionRecorder';
import { AIInitializationResult, AIServiceMetrics, AIAgentConfig } from '@/types/aiCore';

export const useAISystem = () => {
  const queryClient = useQueryClient();

  // System initialization query
  const initializationQuery = useQuery({
    queryKey: ['ai-system-initialization'],
    queryFn: async (): Promise<AIInitializationResult> => {
      return aiSystemInitializer.initialize();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // System metrics query
  const metricsQuery = useQuery({
    queryKey: ['ai-system-metrics'],
    queryFn: (): AIServiceMetrics => {
      return aiMetricsCollector.getMetrics();
    },
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Agents query
  const agentsQuery = useQuery({
    queryKey: ['ai-system-agents'],
    queryFn: async (): Promise<AIAgentConfig[]> => {
      await aiAgentManager.loadAgents();
      return aiAgentManager.getAllAgents();
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Reinitialize mutation
  const reinitializeMutation = useMutation({
    mutationFn: async (): Promise<AIInitializationResult> => {
      return aiSystemInitializer.reinitialize();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-system-initialization'] });
      queryClient.invalidateQueries({ queryKey: ['ai-system-agents'] });
    },
  });

  // Refresh agents mutation
  const refreshAgentsMutation = useMutation({
    mutationFn: async (): Promise<void> => {
      await aiAgentManager.refreshAgents();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-system-agents'] });
    },
  });

  // Record feedback mutation
  const recordFeedbackMutation = useMutation({
    mutationFn: async ({ decisionId, feedback }: { decisionId: string; feedback: 'positive' | 'negative' }): Promise<boolean> => {
      return aiDecisionRecorder.recordFeedback(decisionId, feedback);
    },
  });

  return {
    // Data
    initializationResult: initializationQuery.data,
    metrics: metricsQuery.data,
    agents: agentsQuery.data || [],
    
    // Loading states
    isInitializing: initializationQuery.isLoading,
    isLoadingMetrics: metricsQuery.isLoading,
    isLoadingAgents: agentsQuery.isLoading,
    
    // Actions
    reinitialize: reinitializeMutation.mutateAsync,
    refreshAgents: refreshAgentsMutation.mutateAsync,
    recordFeedback: recordFeedbackMutation.mutateAsync,
    
    // Status
    isInitialized: aiSystemInitializer.isSystemInitialized(),
    isReinitializing: reinitializeMutation.isPending,
    isRefreshingAgents: refreshAgentsMutation.isPending,
  };
};
