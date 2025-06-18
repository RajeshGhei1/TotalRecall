
import { useQuery } from '@tanstack/react-query';

interface TenantData {
  tenant_id: string;
  tenant_name: string;
  is_development: boolean;
}

export const useStableTenantContext = () => {
  return useQuery({
    queryKey: ['stable-tenant-context'],
    queryFn: async (): Promise<TenantData> => {
      // Mock implementation - in reality this would fetch from Supabase
      return {
        tenant_id: 'default-tenant',
        tenant_name: 'Default Tenant',
        is_development: true
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};
