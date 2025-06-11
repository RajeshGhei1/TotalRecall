
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface FormAnalyticsSummary {
  total_views: number;
  total_starts: number;
  total_submissions: number;
  total_abandons: number;
  conversion_rate: number;
  completion_rate: number;
  abandon_rate: number;
}

export interface FormPerformanceData {
  date: string;
  views: number;
  starts: number;
  submissions: number;
  abandons: number;
}

export const useFormAnalyticsSummary = (
  formId: string,
  dateRange?: { start: string; end: string }
) => {
  return useQuery({
    queryKey: ['form-analytics-summary', formId, dateRange],
    queryFn: async () => {
      if (!formId) return null;

      let query = supabase
        .from('form_response_analytics')
        .select('event_type, event_data')
        .eq('form_id', formId);

      if (dateRange) {
        query = query
          .gte('created_at', dateRange.start)
          .lte('created_at', dateRange.end);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Calculate metrics from analytics data
      const total_views = data.filter(d => d.event_type === 'form_view').length;
      const total_starts = data.filter(d => d.event_type === 'form_start').length;
      const total_submissions = data.filter(d => d.event_type === 'form_submit').length;
      const total_abandons = data.filter(d => d.event_type === 'form_abandon').length;

      const conversion_rate = total_views > 0 ? Math.round((total_submissions / total_views) * 100) : 0;
      const completion_rate = total_starts > 0 ? Math.round((total_submissions / total_starts) * 100) : 0;
      const abandon_rate = total_starts > 0 ? Math.round((total_abandons / total_starts) * 100) : 0;

      return {
        total_views,
        total_starts,
        total_submissions,
        total_abandons,
        conversion_rate,
        completion_rate,
        abandon_rate
      } as FormAnalyticsSummary;
    },
    enabled: !!formId,
  });
};

export const useFormPerformanceAnalytics = (formId: string, days = 30) => {
  return useQuery({
    queryKey: ['form-performance-analytics', formId, days],
    queryFn: async () => {
      if (!formId) return [];

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('form_response_analytics')
        .select('event_type, created_at')
        .eq('form_id', formId)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Group by date and event type
      const dailyData: Record<string, FormPerformanceData> = {};

      data.forEach(event => {
        const date = new Date(event.created_at).toISOString().split('T')[0];
        
        if (!dailyData[date]) {
          dailyData[date] = {
            date,
            views: 0,
            starts: 0,
            submissions: 0,
            abandons: 0
          };
        }

        switch (event.event_type) {
          case 'form_view':
            dailyData[date].views++;
            break;
          case 'form_start':
            dailyData[date].starts++;
            break;
          case 'form_submit':
            dailyData[date].submissions++;
            break;
          case 'form_abandon':
            dailyData[date].abandons++;
            break;
        }
      });

      return Object.values(dailyData).sort((a, b) => a.date.localeCompare(b.date));
    },
    enabled: !!formId,
  });
};
