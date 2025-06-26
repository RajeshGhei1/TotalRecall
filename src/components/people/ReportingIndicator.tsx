
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
  console.log('ReportingIndicator rendering for personId:', personId);

  const { data: reportingData, isLoading, error } = useQuery({
    queryKey: ['reporting-indicator', personId],
    queryFn: async () => {
      console.log('Fetching reporting data for person:', personId);
      
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

      console.log('Current relationship:', currentRelationship);

      // Get direct reports count
      const { count: directReportsCount } = await supabase
        .from('company_relationships')
        .select('*', { count: 'exact', head: true })
        .eq('reports_to', personId)
        .eq('is_current', true);

      console.log('Direct reports count:', directReportsCount);

      const result = {
        hasManager: !!currentRelationship?.reports_to,
        managerName: currentRelationship?.people?.full_name || null,
        directReportsCount: directReportsCount || 0,
      };

      console.log('Reporting data result:', result);
      return result;
    },
    enabled: !!personId,
  });

  if (isLoading) {
    console.log('ReportingIndicator loading...');
    return (
      <div className="flex gap-2">
        <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    console.error('Error fetching reporting data:', error);
    return null;
  }

  if (!reportingData) {
    console.log('No reporting data');
    return null;
  }

  const { hasManager, managerName, directReportsCount } = reportingData;

  // Show something even if there's no reporting relationship for debugging
  if (!hasManager && directReportsCount === 0) {
    console.log('No reporting relationships found');
    // Temporarily show a debug badge
    return (
      <div className="flex gap-2 flex-wrap">
        <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200 text-gray-500">
          No reporting relationships
        </Badge>
      </div>
    );
  }

  console.log('Rendering badges - hasManager:', hasManager, 'directReportsCount:', directReportsCount);

  return (
    <div className="flex gap-2 flex-wrap">
      {hasManager && (
        <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700">
          <ArrowUp className="w-3 h-3 mr-1" />
          {showDetails && managerName ? `Reports to ${managerName}` : 'Has Manager'}
        </Badge>
      )}
      {directReportsCount > 0 && (
        <Badge variant="outline" className="text-xs bg-green-50 border-green-200 text-green-700">
          <ArrowDown className="w-3 h-3 mr-1" />
          {directReportsCount} Direct Report{directReportsCount !== 1 ? 's' : ''}
        </Badge>
      )}
    </div>
  );
};

export default ReportingIndicator;
