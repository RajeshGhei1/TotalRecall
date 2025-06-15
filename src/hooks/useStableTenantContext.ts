
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useStableTenantContext = () => {
  const { user, bypassAuth } = useAuth();

  return useQuery({
    queryKey: ['stableTenantContext', user?.id],
    queryFn: async () => {
      if (bypassAuth) {
        // For super admin, try to get the first available tenant or create a dev context
        const { data: tenants } = await supabase
          .from('tenants')
          .select('id, name')
          .limit(1);

        if (tenants && tenants.length > 0) {
          return { 
            tenant_id: tenants[0].id,
            tenant_name: tenants[0].name,
            is_development: true 
          };
        }

        // Fallback to null for super admin if no tenants exist
        return { 
          tenant_id: null,
          tenant_name: 'Super Admin Context',
          is_development: true 
        };
      }
      
      if (!user) return null;
      
      // For regular users, get their profile (without tenant_id since column doesn't exist)
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .eq('id', user.id)
        .single();

      return profile ? { 
        tenant_id: user.id, // Use user ID as fallback tenant context
        tenant_name: profile.full_name || profile.email || 'User Context',
        is_development: false 
      } : null;
    },
    enabled: !!user || bypassAuth,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (replaces deprecated cacheTime)
  });
};
