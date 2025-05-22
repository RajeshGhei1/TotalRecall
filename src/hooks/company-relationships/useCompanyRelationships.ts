
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CompanyRelationship } from '@/types/company-relationship';

export const useCompanyRelationships = (companyId?: string) => {
  const { data: relationships = [] } = useQuery({
    queryKey: ['company-relationships', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      
      const { data, error } = await supabase
        .from('company_relationships')
        .select('*')
        .eq('company_id', companyId);
        
      if (error) throw error;
      
      return data as CompanyRelationship[];
    },
    enabled: !!companyId,
  });

  return { relationships };
};
