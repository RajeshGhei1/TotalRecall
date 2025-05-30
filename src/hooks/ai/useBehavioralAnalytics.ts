
import { useQuery, useMutation } from '@tanstack/react-query';
import { behavioralAnalyticsService } from '@/services/ai/behavioralService';
import { useAdminContext } from '@/hooks/useAdminContext';

export const useBehavioralAnalytics = () => {
  const { adminType } = useAdminContext();

  // For now, we'll use a mock user ID since we don't have auth context
  // This will be replaced with actual auth when implemented
  const mockUserId = 'mock-user-id';
  const mockTenantId = 'mock-tenant-id';

  const { data: userPatterns, isLoading: patternsLoading } = useQuery({
    queryKey: ['user-patterns', mockUserId, mockTenantId],
    queryFn: () => behavioralAnalyticsService.getUserPatterns(mockUserId, mockTenantId),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const { data: behaviorAnalysis, isLoading: analysisLoading } = useQuery({
    queryKey: ['behavior-analysis', mockUserId, mockTenantId],
    queryFn: () => behavioralAnalyticsService.analyzeUserBehavior(mockUserId, mockTenantId),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });

  const trackInteraction = useMutation({
    mutationFn: ({ interactionType, context, metadata }: {
      interactionType: string;
      context: Record<string, any>;
      metadata?: Record<string, any>;
    }) => {
      return behavioralAnalyticsService.trackInteraction(
        mockUserId,
        mockTenantId,
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
