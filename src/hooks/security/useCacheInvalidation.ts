
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useTenantContext } from '@/contexts/TenantContext';
import { useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to handle cache invalidation strategies for security-sensitive operations
 */
export const useCacheInvalidation = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { selectedTenantId } = useTenantContext();

  // Clear all caches when user changes
  const clearUserCaches = useCallback(() => {
    queryClient.clear();
    console.log('Cleared all caches due to user change');
  }, [queryClient]);

  // Clear tenant-specific caches when tenant changes
  const clearTenantCaches = useCallback(() => {
    queryClient.invalidateQueries({
      predicate: (query) => {
        const queryKey = query.queryKey;
        return queryKey.some(key => 
          typeof key === 'string' && 
          (key.includes('tenant') || key.includes('report') || key.includes('form'))
        );
      }
    });
    console.log('Cleared tenant-specific caches');
  }, [queryClient]);

  // Clear security-sensitive caches (audit logs, user sessions, etc.)
  const clearSecurityCaches = useCallback(() => {
    queryClient.invalidateQueries({
      predicate: (query) => {
        const queryKey = query.queryKey;
        return queryKey.some(key => 
          typeof key === 'string' && 
          (key.includes('audit') || key.includes('session') || key.includes('security'))
        );
      }
    });
    console.log('Cleared security-sensitive caches');
  }, [queryClient]);

  // Clear specific cache patterns
  const clearCachePattern = useCallback((pattern: string) => {
    queryClient.invalidateQueries({
      predicate: (query) => {
        const queryKey = query.queryKey;
        return queryKey.some(key => 
          typeof key === 'string' && key.includes(pattern)
        );
      }
    });
    console.log(`Cleared caches matching pattern: ${pattern}`);
  }, [queryClient]);

  // Set up automatic cache clearing on auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        clearUserCaches();
      }
      if (event === 'SIGNED_IN') {
        // Clear any existing caches when user signs in
        clearUserCaches();
      }
    });

    return () => subscription.unsubscribe();
  }, [clearUserCaches]);

  // Clear tenant caches when tenant changes
  useEffect(() => {
    clearTenantCaches();
  }, [selectedTenantId, clearTenantCaches]);

  return {
    clearUserCaches,
    clearTenantCaches,
    clearSecurityCaches,
    clearCachePattern
  };
};
