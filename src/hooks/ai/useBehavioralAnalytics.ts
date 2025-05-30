
import { useQuery, useMutation } from '@tanstack/react-query';
import { behavioralAnalyticsService } from '@/services/ai/behavioralService';
import { useAdminContext } from '@/hooks/useAdminContext';
import { useTenantContext } from '@/contexts/TenantContext';

export const useBehavioralAnalytics = () => {
  const { adminType } = useAdminContext();
  const { selectedTenantId } = useTenantContext();

  // Use actual tenant context when available, fallback to mock for development
  const tenantId = selectedTenantId || 'mock-tenant-id';
  const userId = 'mock-user-id'; // This will be replaced with actual auth when implemented

  const { data: userPatterns, isLoading: patternsLoading } = useQuery({
    queryKey: ['user-patterns', userId, tenantId],
    queryFn: async () => {
      try {
        return await behavioralAnalyticsService.getUserPatterns(userId, tenantId);
      } catch (error) {
        console.error('Error fetching user patterns:', error);
        return [];
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const { data: behaviorAnalysis, isLoading: analysisLoading } = useQuery({
    queryKey: ['behavior-analysis', userId, tenantId],
    queryFn: async () => {
      try {
        return await behavioralAnalyticsService.analyzeUserBehavior(userId, tenantId);
      } catch (error) {
        console.error('Error analyzing behavior:', error);
        return { 
          patterns: {}, 
          insights: [], 
          recommendations: [], 
          isAIEnhanced: false,
          totalInteractions: 0 
        };
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
          userId,
          tenantId,
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
    behaviorAnalysis: behaviorAnalysis || { 
      patterns: {}, 
      insights: [], 
      recommendations: [], 
      isAIEnhanced: false,
      totalInteractions: 0 
    },
    patternsLoading,
    analysisLoading,
    trackInteraction: trackInteraction.mutateAsync,
    isTracking: trackInteraction.isPending,
    selectedTenantId: tenantId,
    isAIEnhanced: behaviorAnalysis?.isAIEnhanced || false
  };
};
