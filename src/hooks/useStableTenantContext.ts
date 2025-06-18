
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface TenantData {
  tenant_id: string;
  tenant_name: string;
  is_development: boolean;
}

export const useStableTenantContext = () => {
  return useQuery({
    queryKey: ['stable-tenant-context'],
    queryFn: async (): Promise<TenantData> => {
      try {
        // First try to get a real tenant from the database
        const { data: tenants, error } = await supabase
          .from('tenants')
          .select('id, name')
          .limit(1);

        if (!error && tenants && tenants.length > 0) {
          return {
            tenant_id: tenants[0].id,
            tenant_name: tenants[0].name,
            is_development: false
          };
        }

        // If no tenants exist or error, create a development tenant
        console.log('No tenants found, using development tenant');
        
        // Generate a proper UUID for development
        const developmentTenantId = '00000000-0000-0000-0000-000000000001';
        
        return {
          tenant_id: developmentTenantId,
          tenant_name: 'Development Tenant',
          is_development: true
        };
      } catch (error) {
        console.error('Error fetching tenant context:', error);
        
        // Fallback to development tenant
        return {
          tenant_id: '00000000-0000-0000-0000-000000000001',
          tenant_name: 'Development Tenant',
          is_development: true
        };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};
