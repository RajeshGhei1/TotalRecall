
import { useEffect, useCallback } from 'react';
import { enhancedBehavioralService, RealTimeInteractionEvent, SmartContext } from '@/services/ai/behavioralService/enhancedBehavioralService';

export const useRealtimeUpdates = (
  userId: string,
  smartContext: SmartContext | null
) => {
  // Real-time updates subscription
  useEffect(() => {
    if (!userId) return;

    const handleRealTimeUpdate = (event: RealTimeInteractionEvent) => {
      if (event.userId === userId) {
        // Update user preferences in real-time
        enhancedBehavioralService.getPersonalizedRecommendations(userId, smartContext!)
          .then(recommendations => {
            // Handle recommendations update
            console.log('Real-time recommendations:', recommendations);
          })
          .catch(error => console.error('Error getting recommendations:', error));
      }
    };

    // Subscribe to real-time updates
    enhancedBehavioralService.subscribeToRealTimeUpdates('*', handleRealTimeUpdate);

    return () => {
      enhancedBehavioralService.unsubscribeFromRealTimeUpdates('*', handleRealTimeUpdate);
    };
  }, [userId, smartContext]);

  // Get personalized recommendations
  const getRecommendations = useCallback(async () => {
    if (!userId || !smartContext) return [];
    
    try {
      return await enhancedBehavioralService.getPersonalizedRecommendations(userId, smartContext);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  }, [userId, smartContext]);

  return {
    getRecommendations
  };
};
