
import { useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { enhancedBehavioralService, RealTimeInteractionEvent, SmartContext } from '@/services/ai/behavioralService/enhancedBehavioralService';
import { useTenantContext } from '@/contexts/TenantContext';

export interface InteractionTrackingOptions {
  enableAutoTracking?: boolean;
  debounceMs?: number;
}

export const useInteractionTracking = (
  userId: string,
  smartContext: SmartContext | null,
  sessionId: string,
  options: InteractionTrackingOptions = {}
) => {
  const { selectedTenantId } = useTenantContext();
  const location = useLocation();
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  const {
    enableAutoTracking = true,
    debounceMs = 300
  } = options;

  // Track interaction with debouncing
  const trackInteraction = useCallback(
    (eventType: string, context: Record<string, unknown> = {}) => {
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
          sessionId
        };

        enhancedBehavioralService.trackRealTimeInteraction(event);
      }, debounceMs);
    },
    [userId, selectedTenantId, location.pathname, smartContext, enableAutoTracking, debounceMs, sessionId]
  );

  // Specific tracking methods
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

  const trackError = useCallback((error: string, context: Record<string, unknown> = {}) => {
    trackInteraction('error', { error, ...context });
  }, [trackInteraction]);

  const trackWorkflowStep = useCallback((workflow: string, step: string, status: string) => {
    trackInteraction('workflow_step', { workflow, step, status });
  }, [trackInteraction]);

  return {
    trackInteraction,
    trackClick,
    trackFormInteraction,
    trackNavigation,
    trackScrolling,
    trackError,
    trackWorkflowStep,
    debounceTimerRef
  };
};
