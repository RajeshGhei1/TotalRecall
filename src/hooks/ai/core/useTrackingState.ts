
import { useState, useRef } from 'react';
import { SmartContext, UserPreference } from '@/services/ai/behavioralService/enhancedBehavioralService';

export interface TrackingState {
  smartContext: SmartContext | null;
  userPreferences: UserPreference[];
  predictedIntents: string[];
  isTracking: boolean;
}

export const useTrackingState = () => {
  const [smartContext, setSmartContext] = useState<SmartContext | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreference[]>([]);
  const [predictedIntents, setPredictedIntents] = useState<string[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const sessionIdRef = useRef(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  return {
    smartContext,
    setSmartContext,
    userPreferences,
    setUserPreferences,
    predictedIntents,
    setPredictedIntents,
    isTracking,
    setIsTracking,
    sessionId: sessionIdRef.current
  };
};
