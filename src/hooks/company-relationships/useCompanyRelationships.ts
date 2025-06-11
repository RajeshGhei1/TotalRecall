
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CompanyRelationship } from '@/types/company-relationship';
import { useSecureQueryKey } from '@/hooks/security/useSecureQueryKey';

export const useCompanyRelationships = (companyId?: string) => {
  const { createSecureKey } = useSecureQueryKey();
  
  return useQuery({
    queryKey: createSecureKey(['company-relationships'], [companyId]),
    queryFn: async () => {
      if (!companyId || companyId === 'new') return [];
      
      const { data, error } = await supabase
        .from('company_relationships')
        .select('*')
        .eq('company_id', companyId);
        
      if (error) throw error;
      
      return data as CompanyRelationship[];
    },
    enabled: !!companyId && companyId !== 'new',
  });
};
