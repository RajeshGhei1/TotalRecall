
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { enhancedBehavioralService, SmartContext } from '@/services/ai/behavioralService/enhancedBehavioralService';

export const useSmartContextDetection = (
  userId: string,
  setSmartContext: (context: SmartContext | null) => void,
  setPredictedIntents: (intents: string[]) => void
) => {
  const location = useLocation();

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
  }, [userId, location.pathname, setSmartContext, setPredictedIntents]);
};
