
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LinkCompanyRelationshipData } from '@/types/company-relationship-types';

export const useCompanyRelationshipMutations = () => {
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
    onError: (error: unknown) => {
      console.error('Error linking person to company:', error);
      toast.error(`Failed to link to company: ${error.message}`);
    }
  });

  return {
    linkPersonToCompany,
    createRelationship: linkPersonToCompany // Alias for linkPersonToCompany to match component usage
  };
};
