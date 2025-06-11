
import { useAuth } from '@/contexts/AuthContext';
import { useTenantContext } from '@/contexts/TenantContext';

/**
 * Hook to generate secure query keys that include user_id, session_id, and tenant_id
 * This prevents cache pollution between different users and sessions
 */
export const useSecureQueryKey = () => {
  const { user, session } = useAuth();
  const { selectedTenantId } = useTenantContext();

  const createSecureKey = (baseKey: string | string[], additionalKeys: (string | number | undefined)[] = []) => {
    // Ensure baseKey is always an array
    const keyArray = Array.isArray(baseKey) ? baseKey : [baseKey];
    
    // Filter out undefined values from additionalKeys and ensure it's an array
    const filteredAdditionalKeys = (additionalKeys || []).filter(key => key !== undefined);
    
    // Always include user and session info for security isolation
    const secureKey = [
      ...keyArray,
      user?.id || 'anonymous',
      session?.access_token?.substring(0, 10) || 'no-session',
      selectedTenantId || 'no-tenant',
      ...filteredAdditionalKeys
    ];

    return secureKey;
  };

  const invalidateUserCache = () => {
    // Return a unique timestamp that can be used to invalidate all user caches
    return `invalidate-${user?.id || 'anonymous'}-${Date.now()}`;
  };

  const invalidateSessionCache = () => {
    // Return a unique timestamp that can be used to invalidate all session caches
    return `invalidate-session-${session?.access_token?.substring(0, 10) || 'no-session'}-${Date.now()}`;
  };

  return {
    createSecureKey,
    invalidateUserCache,
    invalidateSessionCache,
    userId: user?.id,
    sessionId: session?.access_token?.substring(0, 10),
    tenantId: selectedTenantId
  };
};
