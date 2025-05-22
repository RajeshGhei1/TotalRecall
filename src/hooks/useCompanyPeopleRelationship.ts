
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
  relationship_type: 'employment' | 'business_contact';
  reports_to?: string;
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
          .update({ 
            is_current: false,
            end_date: new Date().toISOString().split('T')[0]
          })
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
      queryClient.invalidateQueries({ queryKey: ['company-org-chart'] });
      queryClient.invalidateQueries({ queryKey: ['person-employment-history'] });
      queryClient.invalidateQueries({ queryKey: ['person-reporting-relationships'] });
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
          reports_to,
          company:companies(id, name)
        `)
        .eq('person_id', personId)
        .order('is_current', { ascending: false })
        .order('start_date', { ascending: false });
        
      if (error) throw error;
      
      return (data || []) as JobHistoryItem[];
    } catch (error) {
      console.error('Error fetching person employment history:', error);
      return [];
    }
  };

  // Hook for fetching a person's employment history with caching
  const usePersonEmploymentHistory = (personId?: string) => {
    return useQuery({
      queryKey: ['person-employment-history', personId],
      queryFn: async () => {
        if (!personId) return [];
        return getPersonEmploymentHistory(personId);
      },
      enabled: !!personId,
    });
  };

  // Hook for fetching a person's reporting relationships
  const usePersonReportingRelationships = (personId?: string) => {
    return useQuery({
      queryKey: ['person-reporting-relationships', personId],
      queryFn: async () => {
        if (!personId) return { manager: null, directReports: [] };
        
        // Fetch manager (who this person reports to)
        const { data: managerData, error: managerError } = await supabase
          .from('company_relationships')
          .select(`
            reports_to,
            manager:people!company_relationships_reports_to_fkey(
              id, full_name, email, type
            )
          `)
          .eq('person_id', personId)
          .eq('is_current', true)
          .not('reports_to', 'is', null)
          .maybeSingle();
          
        if (managerError) throw managerError;
        
        // Fetch direct reports (who reports to this person)
        const { data: directReportsData, error: directReportsError } = await supabase
          .from('company_relationships')
          .select(`
            person:people!company_relationships_person_id_fkey(
              id, full_name, email, type
            ),
            role
          `)
          .eq('reports_to', personId)
          .eq('is_current', true);
          
        if (directReportsError) throw directReportsError;
        
        return {
          manager: managerData?.manager || null,
          directReports: directReportsData || []
        };
      },
      enabled: !!personId,
    });
  };

  return {
    linkPersonToCompany,
    createRelationship, // Explicitly expose the alias
    relationships, 
    getPersonEmploymentHistory,
    usePersonEmploymentHistory,
    usePersonReportingRelationships
  };
};
