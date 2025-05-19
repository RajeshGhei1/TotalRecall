
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Person {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  type: 'talent' | 'contact';
  created_at: string;
  updated_at: string;
  // Additional fields for talent
  location?: string;
  years_of_experience?: number;
  current_company?: {
    id: string;
    name: string;
    role: string;
  } | null;
}

interface CreatePersonData {
  full_name: string;
  email: string;
  phone?: string;
  type: 'talent' | 'contact';
  location?: string;
}

export const usePeople = (personType?: 'talent' | 'contact', searchQuery?: string, companyFilter?: string) => {
  const queryClient = useQueryClient();

  // Fetch all people of a specific type
  const getPeople = async (): Promise<Person[]> => {
    const filters = [personType ? `type.eq.${personType}` : null]
      .filter(Boolean)
      .join(',');
      
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
      
    if (filters) {
      query = query.or(filters);
    }
    
    if (searchQuery) {
      query = query.or(`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching people:', error);
      throw error;
    }
    
    // Fetch current company for each person if needed
    if (companyFilter && companyFilter !== 'all') {
      const filteredData = [];
      
      for (const person of data) {
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
    
    // If no company filter, just get current company info for display
    const enhancedData = await Promise.all(
      data.map(async (person) => {
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
          .single();
          
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
  };
  
  // Create a new person
  const createPerson = useMutation({
    mutationFn: async (data: CreatePersonData) => {
      const { error, data: newPerson } = await supabase
        .from('people')
        .insert([data])
        .select()
        .single();
        
      if (error) throw error;
      
      return newPerson;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people', personType] });
    },
    onError: (error: any) => {
      console.error('Error creating person:', error);
      toast.error(`Failed to create ${personType}: ${error.message}`);
    }
  });
  
  // Delete a person
  const deletePerson = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('people')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people', personType] });
      toast.success(`${personType === 'talent' ? 'Talent' : 'Contact'} deleted successfully`);
    },
    onError: (error: any) => {
      console.error('Error deleting person:', error);
      toast.error(`Failed to delete ${personType}: ${error.message}`);
    }
  });

  // Get a person by ID
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
    
    return data;
  };
  
  // Use the query
  const {
    data: people = [],
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['people', personType, searchQuery, companyFilter],
    queryFn: getPeople,
    enabled: true,
  });

  return {
    people,
    isLoading,
    isError,
    error,
    createPerson,
    deletePerson,
    getPersonById
  };
};
