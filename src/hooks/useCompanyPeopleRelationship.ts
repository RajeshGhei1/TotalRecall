
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { JobHistoryItem } from '@/components/people/JobHistoryList';
import { CompanyRelationship } from '@/types/company-relationship';

interface LinkCompanyRelationshipData {
  person_id: string;
  company_id: string;
  role: string;
  start_date: string;
  end_date?: string | null;
  is_current: boolean;
  relationship_type: string;
}

export const useCompanyPeopleRelationship = (companyId?: string) => {
  const queryClient = useQueryClient();

  const linkPersonToCompany = useMutation({
    mutationFn: async (data: LinkCompanyRelationshipData) => {
      // If this is a current role, make sure no other current roles exist for this person
      if (data.is_current) {
        // Update any other current relationships to not be current
        const { error: updateError } = await supabase
          .from('company_relationships')
          .update({ is_current: false })
          .eq('person_id', data.person_id)
          .eq('is_current', true);
          
        if (updateError) throw updateError;
      }
      
      // Create the new relationship
      const { data: relationship, error } = await supabase
        .from('company_relationships')
        .insert([data])
        .select()
        .single();
        
      if (error) throw error;
      
      return relationship;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] });
      queryClient.invalidateQueries({ queryKey: ['company-relationships'] });
      toast.success('Company relationship added successfully');
    },
    onError: (error: any) => {
      console.error('Error linking person to company:', error);
      toast.error(`Failed to link to company: ${error.message}`);
    }
  });
  
  // Alias for linkPersonToCompany to match component usage
  const createRelationship = linkPersonToCompany;
  
  // Query to get relationships for a specific company
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
  
  const getPersonEmploymentHistory = async (personId: string): Promise<JobHistoryItem[]> => {
    try {
      const { data, error } = await supabase
        .from('company_relationships')
        .select(`
          id, 
          role,
          start_date, 
          end_date, 
          is_current,
          company:companies(id, name)
        `)
        .eq('person_id', personId)
        .order('start_date', { ascending: false });
        
      if (error) throw error;
      
      return (data || []) as JobHistoryItem[];
    } catch (error) {
      console.error('Error fetching person employment history:', error);
      return [];
    }
  };

  return {
    linkPersonToCompany,
    createRelationship, // Explicitly expose the alias
    relationships, 
    getPersonEmploymentHistory
  };
};
