
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enhancedAIOrchestrationService } from '@/services/ai/enhancedOrchestrationService';
import { AIContext } from '@/types/ai';
import { useTenantContext } from '@/contexts/TenantContext';
import { useEffect } from 'react';

export const useEnhancedAIOrchestration = () => {
  const queryClient = useQueryClient();
  const { selectedTenantId } = useTenantContext();

  // Initialize the service
  useEffect(() => {
    enhancedAIOrchestrationService.initialize();
  }, []);

  const { data: agents, isLoading: agentsLoading, error } = useQuery({
    queryKey: ['enhanced-ai-agents'],
    queryFn: () => {
      try {
        return enhancedAIOrchestrationService.getActiveAgents();
      } catch (error) {
        console.error('Error fetching AI agents:', error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: metrics } = useQuery({
    queryKey: ['ai-orchestration-metrics'],
    queryFn: () => enhancedAIOrchestrationService.getMetrics(),
    refetchInterval: 10000, // Refresh every 10 seconds
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
      console.log('Enhanced AI prediction request successful');
      // Refresh metrics after successful request
      queryClient.invalidateQueries({ queryKey: ['ai-orchestration-metrics'] });
    },
    onError: (error) => {
      console.error('Enhanced AI prediction request failed:', error);
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
      queryClient.invalidateQueries({ queryKey: ['enhanced-ai-agents'] });
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
    refreshAgents: refreshAgents.mutateAsync,
    isRequesting: requestPrediction.isPending,
    selectedTenantId
  };
};
