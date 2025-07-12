
import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { useRealTimeBehaviorTracking } from './useRealTimeBehaviorTracking';
import { useTenantContext } from '@/contexts/TenantContext';

export const useNavigationTracking = (userId: string = 'demo-user') => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const { selectedTenantId } = useTenantContext();
  const { trackNavigation } = useRealTimeBehaviorTracking(userId);

  useEffect(() => {
    // Track navigation events
    trackNavigation(
      document.referrer || 'direct',
      location.pathname,
      navigationType
    );
  }, [location.pathname, navigationType, trackNavigation]);

  const trackModuleNavigation = (fromModule: string, toModule: string) => {
    trackNavigation(`/module/${fromModule}`, `/module/${toModule}`, 'module_switch');
  };

  const trackFeatureUsage = (feature: string, context: Record<string, unknown> = {}) => {
    trackNavigation(location.pathname, `${location.pathname}#${feature}`, 'feature_use');
  };

  return {
    trackModuleNavigation,
    trackFeatureUsage
  };
};
