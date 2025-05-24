
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Person } from '@/types/person';
import { PersonQueryResult, CompanyRelationshipQueryResult } from '@/types/supabase-query-types';

interface CompanyRelationshipWithCompany {
  id: string;
  company: {
    id: string;
    name: string;
  } | null;
  role: string;
  is_current: boolean;
}

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
      
      const peopleData = data as PersonQueryResult[];
      
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
            
          const typedRelationship = relationships as CompanyRelationshipWithCompany | null;
          
          if (typedRelationship && typedRelationship.company && typedRelationship.company.id === companyFilter) {
            const personWithCompany: Person = {
              ...person,
              type: person.type as 'talent' | 'contact',
              current_company: {
                id: typedRelationship.company.id,
                name: typedRelationship.company.name,
                role: typedRelationship.role
              }
            };
            filteredData.push(personWithCompany);
          }
        }
        
        return filteredData;
      }
      
      // Otherwise, fetch current company info for all people
      const enhancedData = await Promise.all(
        peopleData.map(async (person): Promise<Person> => {
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
            
          const typedRelationship = relationship as CompanyRelationshipWithCompany | null;
          
          const personWithPossibleCompany: Person = {
            ...person,
            type: person.type as 'talent' | 'contact'
          };
          
          if (typedRelationship && typedRelationship.company) {
            personWithPossibleCompany.current_company = {
              id: typedRelationship.company.id,
              name: typedRelationship.company.name,
              role: typedRelationship.role
            };
          }
          
          return personWithPossibleCompany;
        })
      );
      
      return enhancedData;
    },
    enabled: true,
  });
};
