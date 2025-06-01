
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enhancedAIOrchestrationService } from '@/services/ai/enhancedOrchestrationService';
import { AIContext } from '@/types/ai';
import { useTenantContext } from '@/contexts/TenantContext';
import { useEffect } from 'react';

export const useUnifiedAIOrchestration = () => {
  const queryClient = useQueryClient();
  const { selectedTenantId } = useTenantContext();

  useEffect(() => {
    enhancedAIOrchestrationService.initialize();
  }, []);

  const { data: agents, isLoading: agentsLoading, error } = useQuery({
    queryKey: ['unified-ai-agents'],
    queryFn: () => {
      try {
        return enhancedAIOrchestrationService.getActiveAgents();
      } catch (error) {
        console.error('Error fetching AI agents:', error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: metrics } = useQuery({
    queryKey: ['unified-ai-metrics'],
    queryFn: () => enhancedAIOrchestrationService.getMetrics(),
    refetchInterval: 10000,
  });

  const requestPrediction = useMutation({
    mutationFn: async ({ 
      context, 
      parameters, 
      priority = 'normal' 
    }: { 
      context: AIContext; 
      parameters: any; 
      priority?: 'low' | 'normal' | 'high' | 'urgent';
    }) => {
      const enhancedContext = {
        ...context,
        tenant_id: context.tenant_id || selectedTenantId || undefined
      };
      return enhancedAIOrchestrationService.requestPrediction(enhancedContext, parameters, priority);
    },
    onSuccess: () => {
      console.log('AI prediction request successful');
      queryClient.invalidateQueries({ queryKey: ['unified-ai-metrics'] });
    },
    onError: (error) => {
      console.error('AI prediction request failed:', error);
    }
  });

  const provideFeedback = useMutation({
    mutationFn: async ({ 
      decisionId, 
      feedback, 
      details 
    }: { 
      decisionId: string; 
      feedback: 'positive' | 'negative'; 
      details?: any;
    }) => {
      return enhancedAIOrchestrationService.provideFeedback(decisionId, feedback, details);
    },
    onSuccess: () => {
      console.log('Feedback provided successfully');
    },
    onError: (error) => {
      console.error('Error providing feedback:', error);
    }
  });

  const refreshAgents = useMutation({
    mutationFn: async () => {
      try {
        await enhancedAIOrchestrationService.refreshAgents();
      } catch (error) {
        console.error('Error refreshing agents:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unified-ai-agents'] });
    }
  });

  return {
    agents: agents || [],
    metrics: metrics || {
      totalRequests: 0,
      cacheHits: 0,
      cacheHitRate: 0,
      queueSize: 0,
      activeAgents: 0
    },
    agentsLoading,
    error,
    requestPrediction: requestPrediction.mutateAsync,
    provideFeedback: provideFeedback.mutateAsync,
    refreshAgents: refreshAgents.mutateAsync,
    isRequesting: requestPrediction.isPending,
    selectedTenantId
  };
};
