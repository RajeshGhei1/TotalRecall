
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSecureQueryKey } from '@/hooks/security/useSecureQueryKey';

export const useFormChangeHistory = (formId?: string) => {
  const { createSecureKey } = useSecureQueryKey();
  
  return useQuery({
    queryKey: createSecureKey('form-change-history', [formId]),
    queryFn: async () => {
      if (!formId) return [];

      const { data, error } = await supabase
        .from('form_change_history')
        .select(`
          *,
          profiles:changed_by (
            id,
            email,
            full_name
          )
        `)
        .eq('form_id', formId)
        .order('changed_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!formId,
  });
};

export const useReportChangeHistory = (reportId?: string) => {
  const { createSecureKey } = useSecureQueryKey();
  
  return useQuery({
    queryKey: createSecureKey('report-change-history', [reportId]),
    queryFn: async () => {
      if (!reportId) return [];

      const { data, error } = await supabase
        .from('report_change_history')
        .select(`
          *,
          profiles:changed_by (
            id,
            email,
            full_name
          )
        `)
        .eq('report_id', reportId)
        .order('changed_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!reportId,
  });
};

export const useAllChangeHistory = () => {
  const { createSecureKey } = useSecureQueryKey();
  
  return useQuery({
    queryKey: createSecureKey('all-change-history'),
    queryFn: async () => {
      // Get both form and report changes
      const [formChanges, reportChanges] = await Promise.all([
        supabase
          .from('form_change_history')
          .select(`
            *,
            profiles:changed_by (
              id,
              email,
              full_name
            ),
            form_definitions:form_id (
              name
            )
          `)
          .order('changed_at', { ascending: false })
          .limit(50),
        supabase
          .from('report_change_history')
          .select(`
            *,
            profiles:changed_by (
              id,
              email,
              full_name
            ),
            saved_reports:report_id (
              name
            )
          `)
          .order('changed_at', { ascending: false })
          .limit(50)
      ]);

      if (formChanges.error) throw formChanges.error;
      if (reportChanges.error) throw reportChanges.error;

      // Combine and sort by timestamp
      const allChanges = [
        ...(formChanges.data || []).map(change => ({ ...change, entity_type: 'form' })),
        ...(reportChanges.data || []).map(change => ({ ...change, entity_type: 'report' }))
      ].sort((a, b) => new Date(b.changed_at).getTime() - new Date(a.changed_at).getTime());

      return allChanges;
    },
  });
};
