
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ReportingIndicatorProps {
  personId: string;
  showDetails?: boolean;
}

const ReportingIndicator: React.FC<ReportingIndicatorProps> = ({ 
  personId, 
  showDetails = false 
}) => {
  const { data: reportingData, isLoading, error } = useQuery({
    queryKey: ['reporting-indicator', personId],
    queryFn: async () => {
      // Get current relationship for this person
      const { data: currentRelationship } = await supabase
        .from('company_relationships')
        .select(`
          reports_to,
          role,
          people!company_relationships_reports_to_fkey (
            id,
            full_name
          )
        `)
        .eq('person_id', personId)
        .eq('is_current', true)
        .maybeSingle();

      // Get direct reports count
      const { count: directReportsCount } = await supabase
        .from('company_relationships')
        .select('*', { count: 'exact', head: true })
        .eq('reports_to', personId)
        .eq('is_current', true);

      const result = {
        hasManager: !!currentRelationship?.reports_to,
        managerName: currentRelationship?.people?.full_name || null,
        directReportsCount: directReportsCount || 0,
      };

      return result;
    },
    enabled: !!personId,
  });

  if (isLoading) {
    return (
      <div className="flex gap-2">
        <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return null;
  }

  if (!reportingData) {
    return null;
  }

  const { hasManager, managerName, directReportsCount } = reportingData;

  // Always show reporting section, even if empty
  return (
    <div className="space-y-2">
      <div className="text-xs font-medium text-gray-600 mb-1">Reporting Structure</div>
      <div className="flex gap-2 flex-wrap">
        {hasManager ? (
          <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700">
            <ArrowUp className="w-3 h-3 mr-1" />
            {showDetails && managerName ? `Reports to ${managerName}` : 'Has Manager'}
          </Badge>
        ) : (
          <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200 text-gray-500">
            No Manager
          </Badge>
        )}
        
        {directReportsCount > 0 ? (
          <Badge variant="outline" className="text-xs bg-green-50 border-green-200 text-green-700">
            <ArrowDown className="w-3 h-3 mr-1" />
            {directReportsCount} Direct Report{directReportsCount !== 1 ? 's' : ''}
          </Badge>
        ) : (
          <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200 text-gray-500">
            No Reports
          </Badge>
        )}
      </div>
    </div>
  );
};

export default ReportingIndicator;
