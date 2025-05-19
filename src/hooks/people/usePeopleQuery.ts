import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Person } from '@/types/person';

export const usePeopleQuery = (
  personType?: 'talent' | 'contact',
  searchQuery?: string,
  companyFilter?: string
) => {
  return useQuery({
    queryKey: ['people', personType, searchQuery, companyFilter],
    queryFn: async (): Promise<Person[]> => {
      // Build the query
      let query = supabase
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
        .order('created_at', { ascending: false });
        
      // Add type filter if specified
      if (personType) {
        query = query.eq('type', personType);
      }
      
      // Add search filter if specified
      if (searchQuery) {
        query = query.or(`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching people:', error);
        throw error;
      }
      
      const peopleData = data as Person[];
      
      // If company filter is applied, fetch and filter by company association
      if (companyFilter && companyFilter !== 'all') {
        const filteredData: Person[] = [];
        
        for (const person of peopleData) {
          const { data: relationships } = await supabase
            .from('company_relationships')
            .select(`
              id,
              company:companies(id, name),
              role,
              is_current
            `)
            .eq('person_id', person.id)
            .eq('is_current', true)
            .single();
            
          if (relationships && relationships.company && relationships.company.id === companyFilter) {
            person.current_company = {
              id: relationships.company.id,
              name: relationships.company.name,
              role: relationships.role
            };
            filteredData.push(person);
          }
        }
        
        return filteredData;
      }
      
      // Otherwise, fetch current company info for all people
      const enhancedData = await Promise.all(
        peopleData.map(async (person) => {
          const { data: relationship } = await supabase
            .from('company_relationships')
            .select(`
              id,
              company:companies(id, name),
              role,
              is_current
            `)
            .eq('person_id', person.id)
            .eq('is_current', true)
            .maybeSingle();
            
          if (relationship && relationship.company) {
            person.current_company = {
              id: relationship.company.id,
              name: relationship.company.name,
              role: relationship.role
            };
          }
          
          return person;
        })
      );
      
      return enhancedData;
    },
    enabled: true,
  });
};
