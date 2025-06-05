
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  useTrackingState,
  useSmartContextDetection,
  useInteractionTracking,
  useAutoTracking,
  useRealtimeUpdates,
  type InteractionTrackingOptions,
  type AutoTrackingOptions
} from './core';

export interface BehaviorTrackingOptions extends InteractionTrackingOptions, AutoTrackingOptions {
  trackNavigation?: boolean;
}

export const useRealTimeBehaviorTracking = (
  userId: string,
  options: BehaviorTrackingOptions = {}
) => {
  const location = useLocation();
  const {
    smartContext,
    setSmartContext,
    userPreferences,
    setUserPreferences,
    predictedIntents,
    setPredictedIntents,
    isTracking,
    setIsTracking,
    sessionId
  } = useTrackingState();

  const {
    trackNavigation: enableNavigationTracking = true,
    ...trackingOptions
  } = options;

  // Initialize smart context detection
  useSmartContextDetection(userId, setSmartContext, setPredictedIntents);

  // Initialize interaction tracking
  const {
    trackInteraction,
    trackClick,
    trackFormInteraction,
    trackNavigation,
    trackScrolling,
    trackError,
    trackWorkflowStep,
    debounceTimerRef
  } = useInteractionTracking(userId, smartContext, sessionId, trackingOptions);

  // Initialize auto-tracking
  useAutoTracking(
    userId,
    options,
    { trackClick, trackScrolling, trackFormInteraction },
    setIsTracking
  );

  // Initialize real-time updates
  const { getRecommendations } = useRealtimeUpdates(userId, smartContext);

  // Track navigation changes
  useEffect(() => {
    if (!enableNavigationTracking || !userId) return;
    
    trackNavigation('previous_page', location.pathname, 'navigation');
  }, [location.pathname, trackNavigation, userId, enableNavigationTracking]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [debounceTimerRef]);

  return {
    // State
    smartContext,
    userPreferences,
    predictedIntents,
    isTracking,
    
    // Tracking methods
    trackInteraction,
    trackClick,
    trackFormInteraction,
    trackNavigation,
    trackScrolling,
    trackError,
    trackWorkflowStep,
    
    // Utilities
    getRecommendations,
    sessionId
  };
};
