
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CompanyRelationship } from '@/types/company-relationship';

interface CreateRelationshipData {
  person_id: string;
  company_id: string;
  role: string;
  relationship_type: 'employment' | 'business_contact';
  start_date: string;
  end_date?: string | null;
  is_current: boolean;
}

export const useCompanyPeopleRelationship = (companyId?: string) => {
  const queryClient = useQueryClient();

  // Fetch all relationships for a company
  const getCompanyRelationships = async () => {
    if (!companyId) return [];
    
    const { data, error } = await supabase
      .from('company_relationships')
      .select('*')
      .eq('company_id', companyId)
      .order('is_current', { ascending: false });
      
    if (error) {
      console.error('Error fetching company relationships:', error);
      throw error;
    }
    
    return data || [];
  };

  // Create a new relationship
  const createRelationship = useMutation({
    mutationFn: async (data: CreateRelationshipData) => {
      const { error } = await supabase
        .from('company_relationships')
        .insert([data]);
        
      if (error) throw error;
      
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-relationships', companyId] });
      toast.success('Person successfully linked to company');
    },
    onError: (error: any) => {
      console.error('Error creating relationship:', error);
      toast.error(`Failed to link person to company: ${error.message}`);
    }
  });

  // Update an existing relationship (e.g., mark as not current)
  const updateRelationship = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: Partial<CreateRelationshipData> }) => {
      const { error } = await supabase
        .from('company_relationships')
        .update(data)
        .eq('id', id);
        
      if (error) throw error;
      
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-relationships', companyId] });
      toast.success('Relationship updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating relationship:', error);
      toast.error(`Failed to update relationship: ${error.message}`);
    }
  });

  // Get a person's employment history
  const getPersonEmploymentHistory = async (personId: string) => {
    const { data, error } = await supabase
      .from('company_relationships')
      .select(`
        *,
        company:companies(id, name)
      `)
      .eq('person_id', personId)
      .order('start_date', { ascending: false });
      
    if (error) {
      console.error('Error fetching person employment history:', error);
      throw error;
    }
    
    return data || [];
  };

  // Fetch a person's current company
  const getPersonCurrentCompany = async (personId: string) => {
    const { data, error } = await supabase
      .from('company_relationships')
      .select(`
        *,
        company:companies(id, name)
      `)
      .eq('person_id', personId)
      .eq('is_current', true)
      .single();
      
    if (error && error.code !== 'PGRST116') { // PGRST116 is for "no rows returned"
      console.error('Error fetching current company:', error);
      throw error;
    }
    
    return data;
  };

  // Use query to get company relationships
  const { data: relationships, isLoading } = useQuery({
    queryKey: ['company-relationships', companyId],
    queryFn: getCompanyRelationships,
    enabled: !!companyId,
  });

  return {
    relationships,
    isLoading,
    createRelationship,
    updateRelationship,
    getPersonEmploymentHistory,
    getPersonCurrentCompany
  };
};
