
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ReportingPerson, CompanyReportingResult } from '@/types/company-relationship-types';

export const useCompanyReportingRelationships = (
  companyId: string,
  searchQuery = '',
  reportingType: 'manager' | 'direct-report' = 'manager'
) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['company-reporting-relationships', companyId, searchQuery, reportingType],
    queryFn: async (): Promise<CompanyReportingResult> => {
      if (!companyId) {
        return { managers: [], directReports: [] };
      }

      try {
        let managers: ReportingPerson[] = [];
        let directReports: ReportingPerson[] = [];
        
        if (reportingType === 'manager' || reportingType === 'direct-report') {
          // Get all people in this company who have direct reports
          const { data: managerData, error: managerError } = await supabase
            .from('company_relationships')
            .select(`
              person_id,
              role,
              reports_to
            `)
            .eq('company_id', companyId)
            .eq('is_current', true);
            
          if (managerError) {
            console.error('Error fetching company relationships:', managerError);
            throw managerError;
          }
          
          // Find unique managers by looking at the reports_to field
          if (managerData && Array.isArray(managerData)) {
            // Get unique manager IDs from reports_to field
            const reportsToValues = managerData
              .filter(item => item.reports_to !== null && item.reports_to !== undefined)
              .map(item => item.reports_to);
              
            const managerIds = [...new Set(reportsToValues)];
            
            // For each manager ID, get the person details and role
            for (const managerId of managerIds) {
              if (managerId) {
                const { data: managerRelationship } = await supabase
                  .from('company_relationships')
                  .select(`role`)
                  .eq('company_id', companyId)
                  .eq('person_id', managerId)
                  .eq('is_current', true)
                  .single();

                const { data: managerPerson } = await supabase
                  .from('people')
                  .select(`
                    id,
                    full_name,
                    email,
                    type
                  `)
                  .eq('id', managerId)
                  .single();
                  
                if (managerPerson && managerRelationship) {
                  // Apply search filter if provided
                  const fullName = managerPerson.full_name || '';
                  const email = managerPerson.email || '';
                  
                  if (!searchQuery || 
                      fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      email.toLowerCase().includes(searchQuery.toLowerCase())) {
                    managers.push({
                      id: managerPerson.id,
                      full_name: fullName,
                      email: email,
                      type: managerPerson.type,
                      role: managerRelationship.role
                    });
                  }
                }
              }
            }
          }
          
          // Get direct reports (people who have a reports_to field)
          const { data: reportData, error: reportError } = await supabase
            .from('company_relationships')
            .select(`
              person_id,
              reports_to,
              role
            `)
            .eq('company_id', companyId)
            .eq('is_current', true)
            .not('reports_to', 'is', null)
            .order('role');
            
          if (reportError) {
            console.error('Error fetching direct reports:', reportError);
            throw reportError;
          }
          
          if (reportData && Array.isArray(reportData)) {
            for (const item of reportData) {
              if (item.person_id) {
                const { data: personData } = await supabase
                  .from('people')
                  .select(`
                    id,
                    full_name,
                    email,
                    type
                  `)
                  .eq('id', item.person_id)
                  .single();
                
                if (personData) {
                  // Apply search filter if provided
                  const fullName = personData.full_name || '';
                  const email = personData.email || '';
                  
                  if (!searchQuery || 
                      fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      email.toLowerCase().includes(searchQuery.toLowerCase())) {
                    directReports.push({
                      id: personData.id,
                      full_name: fullName,
                      email: email,
                      type: personData.type,
                      role: item.role
                    });
                  }
                }
              }
            }
          }
        }
        
        return {
          managers,
          directReports
        };
      } catch (error) {
        console.error('Error fetching company reporting relationships:', error);
        return { managers: [], directReports: [] };
      }
    },
    enabled: !!companyId
  });

  return {
    data: data || { managers: [], directReports: [] },
    isLoading,
    error
  };
};
