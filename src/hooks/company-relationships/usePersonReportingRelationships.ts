
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ReportingPerson, ReportingRelationshipsResult } from '@/types/company-relationship-types';

export const usePersonReportingRelationships = (
  personId?: string,
  companyId?: string
) => {
  const { data: reportingRelationships = { manager: null, directReports: [] }, isLoading, isError, error } = useQuery({
    queryKey: ['person-reporting-relationships', personId, companyId],
    queryFn: async (): Promise<ReportingRelationshipsResult> => {
      if (!personId || !companyId) {
        return { manager: null, directReports: [] };
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
        
        if (personData && personData.reports_to && personData.manager) {
          const managerData = personData.manager;
          let managerRole = undefined;
          
          if (managerData && 
              managerData.manager_role && 
              Array.isArray(managerData.manager_role) && 
              managerData.manager_role.length > 0 && 
              managerData.manager_role[0]) {
            managerRole = managerData.manager_role[0].role;
          }
          
          if (managerData && typeof managerData === 'object' && 'id' in managerData) {
            managerPerson = {
              id: managerData.id || '',
              full_name: managerData.full_name || '',
              email: managerData.email || null,
              type: managerData.type || '',
              role: managerRole
            };
          }
        }

        const directReports: ReportingPerson[] = [];
        
        if (reportsData && Array.isArray(reportsData)) {
          for (const item of reportsData) {
            if (item && item.person && typeof item.person === 'object' && 'id' in item.person) {
              const personObj = item.person;
              let role = undefined;
              
              if (personObj && personObj.role && 
                  Array.isArray(personObj.role) && 
                  personObj.role.length > 0 && 
                  personObj.role[0]) {
                role = personObj.role[0]?.role;
              }
              
              if (personObj) {
                directReports.push({
                  id: personObj.id || '',
                  full_name: personObj.full_name || '',
                  email: personObj.email || null,
                  type: personObj.type || '',
                  role: role
                });
              }
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
