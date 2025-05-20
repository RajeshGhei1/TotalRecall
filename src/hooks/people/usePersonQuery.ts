
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Person } from '@/types/person';

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
      
      return data;
    },
    enabled: !!id
  });
};
