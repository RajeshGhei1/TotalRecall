
import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { enhancedBehavioralService, RealTimeInteractionEvent, SmartContext, UserPreference } from '@/services/ai/behavioralService/enhancedBehavioralService';
import { useTenantContext } from '@/contexts/TenantContext';

export interface BehaviorTrackingOptions {
  enableAutoTracking?: boolean;
  trackScrolling?: boolean;
  trackClicks?: boolean;
  trackFormInteractions?: boolean;
  trackNavigation?: boolean;
  debounceMs?: number;
}

export const useRealTimeBehaviorTracking = (
  userId: string,
  options: BehaviorTrackingOptions = {}
) => {
  const { selectedTenantId } = useTenantContext();
  const location = useLocation();
  const [smartContext, setSmartContext] = useState<SmartContext | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreference[]>([]);
  const [predictedIntents, setPredictedIntents] = useState<string[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const sessionIdRef = useRef(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  const {
    enableAutoTracking = true,
    trackScrolling = true,
    trackClicks = true,
    trackFormInteractions = true,
    trackNavigation = true,
    debounceMs = 300
  } = options;

  // Initialize smart context detection
  useEffect(() => {
    if (userId) {
      const context = enhancedBehavioralService.detectSmartContext(
        userId,
        location.pathname,
        navigator.userAgent
      );
      setSmartContext(context);
      
      // Predict user intents based on context
      enhancedBehavioralService.predictUserIntent(userId, context)
        .then(intents => setPredictedIntents(intents))
        .catch(error => console.error('Error predicting user intents:', error));
    }
  }, [userId, location.pathname]);

  // Track interaction with debouncing
  const trackInteraction = useCallback(
    (eventType: string, context: Record<string, any> = {}) => {
      if (!userId || !enableAutoTracking) return;

      // Clear existing debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Debounce the tracking call
      debounceTimerRef.current = setTimeout(() => {
        const event: RealTimeInteractionEvent = {
          userId,
          tenantId: selectedTenantId || undefined,
          eventType,
          context: {
            ...context,
            path: location.pathname,
            smartContext,
            timestamp: Date.now()
          },
          timestamp: Date.now(),
          sessionId: sessionIdRef.current
        };

        enhancedBehavioralService.trackRealTimeInteraction(event);
      }, debounceMs);
    },
    [userId, selectedTenantId, location.pathname, smartContext, enableAutoTracking, debounceMs]
  );

  // Track specific event types
  const trackClick = useCallback((target: string, metadata: Record<string, any> = {}) => {
    trackInteraction('click', { target, ...metadata });
  }, [trackInteraction]);

  const trackFormInteraction = useCallback((formId: string, fieldName: string, action: string) => {
    trackInteraction('form_interaction', { formId, fieldName, action });
  }, [trackInteraction]);

  const trackNavigation = useCallback((from: string, to: string, method: string = 'click') => {
    trackInteraction('navigation', { from, to, method });
  }, [trackInteraction]);

  const trackScrolling = useCallback((scrollPercentage: number, section: string) => {
    trackInteraction('scroll', { scrollPercentage, section });
  }, [trackInteraction]);

  const trackError = useCallback((error: string, context: Record<string, any> = {}) => {
    trackInteraction('error', { error, ...context });
  }, [trackInteraction]);

  const trackWorkflowStep = useCallback((workflow: string, step: string, status: string) => {
    trackInteraction('workflow_step', { workflow, step, status });
  }, [trackInteraction]);

  // Auto-tracking setup
  useEffect(() => {
    if (!enableAutoTracking || !userId) return;

    setIsTracking(true);

    const handleClick = (event: MouseEvent) => {
      if (!trackClicks) return;
      
      const target = event.target as HTMLElement;
      const elementInfo = {
        tagName: target.tagName,
        className: target.className,
        id: target.id,
        text: target.textContent?.slice(0, 100)
      };
      
      trackClick('auto_click', elementInfo);
    };

    const handleScroll = () => {
      if (!trackScrolling) return;
      
      const scrollPercentage = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      trackScrolling(scrollPercentage, 'page');
    };

    const handleFormInteraction = (event: Event) => {
      if (!trackFormInteractions) return;
      
      const target = event.target as HTMLInputElement;
      if (target.form) {
        const formId = target.form.id || 'unnamed_form';
        const fieldName = target.name || target.id || 'unnamed_field';
        trackFormInteraction(formId, fieldName, event.type);
      }
    };

    // Add event listeners
    if (trackClicks) {
      document.addEventListener('click', handleClick);
    }
    
    if (trackScrolling) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    if (trackFormInteractions) {
      document.addEventListener('focus', handleFormInteraction, true);
      document.addEventListener('blur', handleFormInteraction, true);
      document.addEventListener('input', handleFormInteraction, true);
    }

    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('focus', handleFormInteraction, true);
      document.removeEventListener('blur', handleFormInteraction, true);
      document.removeEventListener('input', handleFormInteraction, true);
      setIsTracking(false);
    };
  }, [
    enableAutoTracking, 
    userId, 
    trackClicks, 
    trackScrolling, 
    trackFormInteractions, 
    trackClick, 
    trackScrolling as any, 
    trackFormInteraction
  ]);

  // Track navigation changes
  useEffect(() => {
    if (!trackNavigation || !userId) return;
    
    trackNavigation('previous_page', location.pathname, 'navigation');
  }, [location.pathname, trackNavigation, userId, trackNavigation as any]);

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

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

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
    trackNavigation: trackNavigation as any,
    trackScrolling: trackScrolling as any,
    trackError,
    trackWorkflowStep,
    
    // Utilities
    getRecommendations,
    sessionId: sessionIdRef.current
  };
};
