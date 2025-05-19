
import { supabase } from '@/integrations/supabase/client';
import { Person } from '@/types/person';

export const usePersonDetails = () => {
  const getPersonById = async (id: string): Promise<Person> => {
    const { data, error } = await supabase
      .from('people')
      .select(`
        id, 
        full_name, 
        email, 
        phone, 
        type,
        created_at,
        updated_at,
        location
      `)
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching person:', error);
      throw error;
    }
    
    return data as Person;
  };

  return {
    getPersonById
  };
};
