
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aiOrchestrationService } from '@/services/ai/orchestrationService';
import { AIContext } from '@/types/ai';

export const useAIOrchestration = () => {
  const queryClient = useQueryClient();

  const { data: agents, isLoading: agentsLoading } = useQuery({
    queryKey: ['ai-agents'],
    queryFn: () => aiOrchestrationService.getActiveAgents(),
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
    mutationFn: () => aiOrchestrationService.refreshAgents(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-agents'] });
    }
  });

  return {
    agents: agents || [],
    agentsLoading,
    requestPrediction: requestPrediction.mutateAsync,
    provideFeedback: provideFeedback.mutateAsync,
    refreshAgents: refreshAgents.mutateAsync,
    isRequesting: requestPrediction.isPending,
    isFeedbackPending: provideFeedback.isPending
  };
};
