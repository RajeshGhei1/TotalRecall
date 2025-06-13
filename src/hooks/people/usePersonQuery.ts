
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Person } from '@/types/person';
import { PersonQueryResult } from '@/types/supabase-query-types';

export const usePersonQuery = (id?: string) => {
  return useQuery({
    queryKey: ['person', id],
    queryFn: async (): Promise<Person | null> => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('people')
        .select(`
          id, 
          full_name, 
          email, 
          phone, 
          type,
          location,
          created_at,
          updated_at
        `)
        .eq('id', id)
        .single();
        
      if (error) {
        console.error('Error fetching person:', error);
        throw error;
      }
      
      // Type the response properly
      const typedData = data as PersonQueryResult;
      
      return {
        ...typedData,
        type: typedData.type as 'talent' | 'contact'
      };
    },
    enabled: !!id
  });
};
