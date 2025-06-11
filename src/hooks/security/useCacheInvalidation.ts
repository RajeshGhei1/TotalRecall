
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useTenantContext } from '@/contexts/TenantContext';

/**
 * Hook for secure cache invalidation with user and tenant isolation
 */
export const useCacheInvalidation = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { selectedTenantId } = useTenantContext();

  const clearCachePattern = (pattern: string) => {
    const userPrefix = `${user?.id || 'anonymous'}`;
    const tenantPrefix = `${selectedTenantId || 'no-tenant'}`;
    
    // Invalidate queries that match the pattern for current user/tenant
    queryClient.invalidateQueries({
      predicate: (query) => {
        const key = query.queryKey;
        return (
          Array.isArray(key) &&
          key.some(k => typeof k === 'string' && k.includes(pattern)) &&
          key.includes(userPrefix) &&
          key.includes(tenantPrefix)
        );
      }
    });
  };

  const clearUserWorkspace = () => {
    const userPrefix = `${user?.id || 'anonymous'}`;
    
    queryClient.invalidateQueries({
      predicate: (query) => {
        const key = query.queryKey;
        return Array.isArray(key) && key.includes(userPrefix);
      }
    });
  };

  const clearTenantWorkspace = () => {
    const tenantPrefix = `${selectedTenantId || 'no-tenant'}`;
    
    queryClient.invalidateQueries({
      predicate: (query) => {
        const key = query.queryKey;
        return Array.isArray(key) && key.includes(tenantPrefix);
      }
    });
  };

  return {
    clearCachePattern,
    clearUserWorkspace,
    clearTenantWorkspace,
  };
};
