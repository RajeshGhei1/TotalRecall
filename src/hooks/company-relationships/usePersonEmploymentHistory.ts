
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { JobHistoryItem } from '@/components/people/JobHistoryList';

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
      
      return (data || []) as JobHistoryItem[];
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
