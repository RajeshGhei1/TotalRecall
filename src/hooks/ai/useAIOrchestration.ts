
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aiOrchestrationService } from '@/services/ai/orchestrationService';
import { AIContext } from '@/types/ai';

export const useAIOrchestration = () => {
  const queryClient = useQueryClient();

  const { data: agents, isLoading: agentsLoading, error } = useQuery({
    queryKey: ['ai-agents'],
    queryFn: () => {
      try {
        return aiOrchestrationService.getActiveAgents();
      } catch (error) {
        console.error('Error fetching AI agents:', error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const requestPrediction = useMutation({
    mutationFn: ({ context, parameters }: { context: AIContext; parameters: any }) =>
      aiOrchestrationService.requestPrediction(context, parameters),
    onSuccess: () => {
      console.log('AI prediction request successful');
    },
    onError: (error) => {
      console.error('AI prediction request failed:', error);
    }
  });

  const provideFeedback = useMutation({
    mutationFn: ({ decisionId, feedback, details }: { 
      decisionId: string; 
      feedback: 'positive' | 'negative'; 
      details?: any 
    }) => aiOrchestrationService.provideFeedback(decisionId, feedback, details),
    onSuccess: () => {
      console.log('AI feedback provided successfully');
    }
  });

  const refreshAgents = useMutation({
    mutationFn: async () => {
      try {
        await aiOrchestrationService.refreshAgents();
      } catch (error) {
        console.error('Error refreshing agents:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-agents'] });
    }
  });

  return {
    agents: agents || [],
    agentsLoading,
    error,
    requestPrediction: requestPrediction.mutateAsync,
    provideFeedback: provideFeedback.mutateAsync,
    refreshAgents: refreshAgents.mutateAsync,
    isRequesting: requestPrediction.isPending,
    isFeedbackPending: provideFeedback.isPending
  };
};
