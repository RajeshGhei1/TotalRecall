
import React, { useEffect } from 'react';
import { useRealTimeBehaviorTracking } from '@/hooks/ai/useRealTimeBehaviorTracking';
import { useTenantContext } from '@/contexts/TenantContext';

interface BehavioralTrackingWrapperProps {
  children: React.ReactNode;
  module: string;
  action: string;
  metadata?: Record<string, any>;
  trackOnMount?: boolean;
  userId?: string;
}

export const BehavioralTrackingWrapper: React.FC<BehavioralTrackingWrapperProps> = ({
  children,
  module,
  action,
  metadata = {},
  trackOnMount = true,
  userId = 'demo-user'
}) => {
  const { selectedTenantId } = useTenantContext();
  const { trackInteraction, trackNavigationAction } = useRealTimeBehaviorTracking(userId);

  useEffect(() => {
    if (trackOnMount) {
      trackInteraction(`${module}_${action}`, {
        module,
        action,
        tenantId: selectedTenantId,
        ...metadata
      });
    }
  }, [module, action, selectedTenantId, trackOnMount, trackInteraction, metadata]);

  return <>{children}</>;
};
