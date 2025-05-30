
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
    queryFn: async () => {
      try {
        return await behavioralAnalyticsService.getUserPatterns(mockUserId, mockTenantId);
      } catch (error) {
        console.error('Error fetching user patterns:', error);
        return [];
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const { data: behaviorAnalysis, isLoading: analysisLoading } = useQuery({
    queryKey: ['behavior-analysis', mockUserId, mockTenantId],
    queryFn: async () => {
      try {
        return await behavioralAnalyticsService.analyzeUserBehavior(mockUserId, mockTenantId);
      } catch (error) {
        console.error('Error analyzing behavior:', error);
        return { patterns: {}, insights: [], recommendations: [] };
      }
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });

  const trackInteraction = useMutation({
    mutationFn: async ({ interactionType, context, metadata }: {
      interactionType: string;
      context: Record<string, any>;
      metadata?: Record<string, any>;
    }) => {
      try {
        return await behavioralAnalyticsService.trackInteraction(
          mockUserId,
          mockTenantId,
          interactionType,
          context,
          metadata
        );
      } catch (error) {
        console.error('Error tracking interaction:', error);
        throw error;
      }
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
