
import { useQuery, useMutation } from '@tanstack/react-query';
import { behavioralAnalyticsService } from '@/services/ai/behavioralService';
import { useAuth } from '@/hooks/useAuth';
import { useAdminContext } from '@/hooks/useAdminContext';

export const useBehavioralAnalytics = () => {
  const { user } = useAuth();
  const { selectedTenant } = useAdminContext();

  const { data: userPatterns, isLoading: patternsLoading } = useQuery({
    queryKey: ['user-patterns', user?.id, selectedTenant?.id],
    queryFn: () => behavioralAnalyticsService.getUserPatterns(user!.id, selectedTenant?.id),
    enabled: !!user?.id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const { data: behaviorAnalysis, isLoading: analysisLoading } = useQuery({
    queryKey: ['behavior-analysis', user?.id, selectedTenant?.id],
    queryFn: () => behavioralAnalyticsService.analyzeUserBehavior(user!.id, selectedTenant?.id),
    enabled: !!user?.id,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });

  const trackInteraction = useMutation({
    mutationFn: ({ interactionType, context, metadata }: {
      interactionType: string;
      context: Record<string, any>;
      metadata?: Record<string, any>;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      return behavioralAnalyticsService.trackInteraction(
        user.id,
        selectedTenant?.id,
        interactionType,
        context,
        metadata
      );
    }
  });

  return {
    userPatterns: userPatterns || [],
    behaviorAnalysis: behaviorAnalysis || { patterns: {}, insights: [], recommendations: [] },
    patternsLoading,
    analysisLoading,
    trackInteraction: trackInteraction.mutateAsync,
    isTracking: trackInteraction.isPending
  };
};
