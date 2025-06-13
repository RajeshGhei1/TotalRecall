
import { useAuth } from '@/contexts/AuthContext';
import { useTenantContext } from '@/contexts/TenantContext';
import { SecurityContext } from '@/types/security';
import { useCallback, useMemo } from 'react';

export const useSecurityContext = (): SecurityContext => {
  const { user, session } = useAuth();
  const { selectedTenantId } = useTenantContext();

  const securityContext = useMemo((): SecurityContext => ({
    userId: user?.id || '',
    sessionId: session?.access_token?.substring(0, 10) || '',
    tenantId: selectedTenantId || '',
    permissions: [], // TODO: Fetch from user roles
    ipAddress: undefined, // TODO: Get client IP
    userAgent: navigator.userAgent,
    timestamp: new Date(),
  }), [user?.id, session?.access_token, selectedTenantId]);

  return securityContext;
};

export const usePermissionCheck = () => {
  const securityContext = useSecurityContext();

  const hasPermission = useCallback((resource: string, action: string): boolean => {
    // TODO: Implement actual permission checking logic
    // For now, return true for authenticated users
    return !!securityContext.userId;
  }, [securityContext.userId]);

  const requirePermission = useCallback((resource: string, action: string): void => {
    if (!hasPermission(resource, action)) {
      throw new Error(`Permission denied: ${action} on ${resource}`);
    }
  }, [hasPermission]);

  return { hasPermission, requirePermission, securityContext };
};
