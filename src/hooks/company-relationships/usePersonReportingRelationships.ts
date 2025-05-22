
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ReportingPerson, ReportingRelationshipsResult } from '@/types/company-relationship-types';

export const usePersonReportingRelationships = (
  personId?: string,
  companyId?: string
) => {
  const { 
    data: reportingRelationships = { manager: null, directReports: [] }, 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ['person-reporting-relationships', personId, companyId],
    queryFn: async () => {
      if (!personId || !companyId) {
        return { manager: null, directReports: [] } as ReportingRelationshipsResult;
      }

      try {
        // First, check if this person reports to someone
        const { data: personData, error: personError } = await supabase
          .from('company_relationships')
          .select(`
            reports_to,
            manager:people!company_relationships_reports_to_fkey(
              id,
              full_name,
              email,
              type,
              manager_role:company_relationships!company_relationships_person_id_fkey(role)
            )
          `)
          .eq('person_id', personId)
          .eq('company_id', companyId)
          .eq('is_current', true)
          .maybeSingle();

        if (personError) {
          console.error('Error fetching manager relationship:', personError);
          throw personError;
        }

        // Then get all people who report to this person
        const { data: reportsData, error: reportsError } = await supabase
          .from('company_relationships')
          .select(`
            person:people!company_relationships_person_id_fkey(
              id, 
              full_name,
              email,
              type,
              role:company_relationships!company_relationships_person_id_fkey(role)
            )
          `)
          .eq('reports_to', personId)
          .eq('company_id', companyId)
          .eq('is_current', true);

        if (reportsError) {
          console.error('Error fetching direct reports:', reportsError);
          throw reportsError;
        }

        // Format data for the response
        let managerPerson: ReportingPerson | null = null;
        
        if (personData?.reports_to && personData?.manager) {
          const managerRole = personData.manager.manager_role?.[0]?.role || '';
          
          managerPerson = {
            id: personData.manager.id,
            full_name: personData.manager.full_name,
            email: personData.manager.email,
            type: personData.manager.type,
            role: managerRole
          };
        }

        const directReports: ReportingPerson[] = [];
        
        if (reportsData) {
          for (const item of reportsData) {
            if (item && item.person) {
              const personRole = item.person.role?.[0]?.role || '';
              
              directReports.push({
                id: item.person.id,
                full_name: item.person.full_name,
                email: item.person.email,
                type: item.person.type,
                role: personRole
              });
            }
          }
        }

        return {
          manager: managerPerson,
          directReports
        };
      } catch (error) {
        console.error('Error fetching reporting relationships:', error);
        return { manager: null, directReports: [] };
      }
    },
    enabled: !!personId && !!companyId,
  });

  return {
    reportingRelationships,
    isLoading,
    isError,
    error
  };
};
