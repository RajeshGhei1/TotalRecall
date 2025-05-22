
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ReportingPerson, ReportingRelationshipsResult } from '@/types/company-relationship-types';

export const usePersonReportingRelationships = (personId?: string) => {
  return useQuery<ReportingRelationshipsResult>({
    queryKey: ['person-reporting-relationships', personId],
    queryFn: async () => {
      if (!personId) return { manager: null, directReports: [] };
      
      try {
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
          
        if (managerError) {
          console.error('Error fetching manager:', managerError);
          return { manager: null, directReports: [] };
        }
        
        // Fetch direct reports (who reports to this person)
        const { data: directReportsData, error: directReportsError } = await supabase
          .from('company_relationships')
          .select(`
            role,
            person:people!company_relationships_person_id_fkey(
              id, full_name, email, type
            )
          `)
          .eq('reports_to', personId)
          .eq('is_current', true);
          
        if (directReportsError) {
          console.error('Error fetching direct reports:', directReportsError);
          return { 
            manager: managerData?.manager || null, 
            directReports: [] 
          };
        }

        // Process and type-safe the direct reports
        const reports: ReportingPerson[] = [];
        if (directReportsData && Array.isArray(directReportsData)) {
          directReportsData.forEach(item => {
            if (item && item.person && typeof item.person === 'object' && 'id' in item.person) {
              reports.push({
                id: item.person.id,
                full_name: item.person.full_name,
                email: item.person.email || null,
                type: item.person.type,
                role: item.role
              });
            }
          });
        }
        
        return {
          manager: managerData?.manager ? {
            id: managerData.manager.id,
            full_name: managerData.manager.full_name,
            email: managerData.manager.email || null,
            type: managerData.manager.type
          } : null,
          directReports: reports
        };
      } catch (error) {
        console.error('Error in usePersonReportingRelationships:', error);
        return { manager: null, directReports: [] };
      }
    },
    enabled: !!personId,
  });
};
