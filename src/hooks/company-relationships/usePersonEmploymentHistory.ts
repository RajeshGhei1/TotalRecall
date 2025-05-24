
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { JobHistoryItem } from '@/components/people/JobHistoryList';
import { EmploymentHistoryQueryResult } from '@/types/supabase-query-types';

export const usePersonEmploymentHistory = (personId?: string) => {
  const getPersonEmploymentHistory = async (id: string): Promise<JobHistoryItem[]> => {
    try {
      const { data, error } = await supabase
        .from('company_relationships')
        .select(`
          id, 
          role,
          start_date, 
          end_date, 
          is_current,
          reports_to,
          company:companies(id, name)
        `)
        .eq('person_id', id)
        .order('is_current', { ascending: false })
        .order('start_date', { ascending: false });
        
      if (error) {
        console.error('Error fetching employment history:', error);
        return [];
      }
      
      // Type the data properly
      const typedData = data as EmploymentHistoryQueryResult[];
      
      return typedData.map(item => ({
        id: item.id,
        role: item.role,
        start_date: item.start_date,
        end_date: item.end_date,
        is_current: item.is_current,
        reports_to: item.reports_to,
        company: item.company
      }));
    } catch (error) {
      console.error('Error fetching person employment history:', error);
      return [];
    }
  };

  const { data: employmentHistory = [], isLoading, isError, error } = useQuery({
    queryKey: ['person-employment-history', personId],
    queryFn: async () => {
      if (!personId) return [];
      return getPersonEmploymentHistory(personId);
    },
    enabled: !!personId,
  });

  return {
    employmentHistory,
    isLoading,
    isError,
    error,
    getPersonEmploymentHistory
  };
};
