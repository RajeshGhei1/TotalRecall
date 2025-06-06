
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enhancedAIOrchestrationService } from '@/services/ai/enhancedOrchestrationService';
import { AIContext } from '@/types/ai';
import { useTenantContext } from '@/contexts/TenantContext';
import { useEffect, useState } from 'react';

export const useUnifiedAIOrchestration = () => {
  const queryClient = useQueryClient();
  const { selectedTenantId } = useTenantContext();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    const initializeService = async () => {
      try {
        console.log('Starting AI orchestration service initialization...');
        await enhancedAIOrchestrationService.initialize();
        if (mounted) {
          setIsInitialized(true);
          console.log('AI orchestration service initialized successfully');
        }
      } catch (error) {
        console.error('Failed to initialize AI orchestration service:', error);
        if (mounted) {
          setIsInitialized(true); // Still set to true to allow queries to run
        }
      }
    };

    initializeService();

    return () => {
      mounted = false;
    };
  }, []);

  const { data: agents, isLoading: agentsLoading, error } = useQuery({
    queryKey: ['unified-ai-agents'],
    queryFn: async () => {
      try {
        console.log('Fetching AI agents...');
        const activeAgents = enhancedAIOrchestrationService.getActiveAgents();
        console.log('Fetched agents:', activeAgents);
        console.log('Number of agents:', activeAgents?.length || 0);
        return activeAgents || [];
      } catch (error) {
        console.error('Error fetching AI agents:', error);
        return [];
      }
    },
    enabled: isInitialized, // Only run query after service is initialized
    staleTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: 1000,
  });

  const { data: metrics } = useQuery({
    queryKey: ['unified-ai-metrics'],
    queryFn: () => enhancedAIOrchestrationService.getMetrics(),
    enabled: isInitialized,
    refetchInterval: 10000,
  });

  const { data: learningInsights } = useQuery({
    queryKey: ['ai-learning-insights', selectedTenantId],
    queryFn: () => {
      // Only fetch insights if we have a valid tenant ID (not null/undefined)
      if (!selectedTenantId) {
        console.log('Skipping learning insights fetch - no tenant selected');
        return {
          learning: {
            totalFeedback: 0,
            positiveRatio: 0,
            topIssues: [],
            improvementAreas: [],
            recentPatterns: []
          },
          context: {
            totalContextsAnalyzed: 0,
            avgSuccessRate: 0,
            riskDistribution: { low: 0, medium: 0, high: 0 },
            topPerformingContexts: [],
            problematicContexts: []
          },
          combinedScore: 0
        };
      }
      return enhancedAIOrchestrationService.getLearningInsights(selectedTenantId);
    },
    enabled: isInitialized,
    refetchInterval: 30000,
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
      queryClient.invalidateQueries({ queryKey: ['ai-learning-insights'] });
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
      queryClient.invalidateQueries({ queryKey: ['ai-learning-insights'] });
    },
    onError: (error) => {
      console.error('Error providing feedback:', error);
    }
  });

  const recordOutcome = useMutation({
    mutationFn: async ({ 
      decisionId, 
      outcome, 
      outcomeData 
    }: { 
      decisionId: string; 
      outcome: 'success' | 'failure' | 'partial_success'; 
      outcomeData?: any;
    }) => {
      return enhancedAIOrchestrationService.recordDecisionOutcome(decisionId, outcome, outcomeData);
    },
    onSuccess: () => {
      console.log('Decision outcome recorded successfully');
      queryClient.invalidateQueries({ queryKey: ['ai-learning-insights'] });
    },
    onError: (error) => {
      console.error('Error recording decision outcome:', error);
    }
  });

  const refreshAgents = useMutation({
    mutationFn: async () => {
      try {
        console.log('Refreshing agents...');
        await enhancedAIOrchestrationService.refreshAgents();
        console.log('Agents refreshed successfully');
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
    learningInsights: learningInsights || {
      learning: {
        totalFeedback: 0,
        positiveRatio: 0,
        topIssues: [],
        improvementAreas: [],
        recentPatterns: []
      },
      context: {
        totalContextsAnalyzed: 0,
        avgSuccessRate: 0,
        riskDistribution: { low: 0, medium: 0, high: 0 },
        topPerformingContexts: [],
        problematicContexts: []
      },
      combinedScore: 0
    },
    agentsLoading,
    error,
    isInitialized,
    requestPrediction: requestPrediction.mutateAsync,
    provideFeedback: provideFeedback.mutateAsync,
    recordOutcome: recordOutcome.mutateAsync,
    refreshAgents: refreshAgents.mutateAsync,
    isRequesting: requestPrediction.isPending,
    selectedTenantId
  };
};
