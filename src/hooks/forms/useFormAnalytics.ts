
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FormResponseAnalytics, FormResponseAnalyticsInsert } from '@/types/form-builder';

// Form Response Analytics
export const useFormAnalytics = (formId?: string, placementId?: string, dateRange?: { start: string; end: string }) => {
  return useQuery({
    queryKey: ['form-analytics', formId, placementId, dateRange],
    queryFn: async () => {
      let query = supabase
        .from('form_response_analytics')
        .select('*')
        .order('created_at', { ascending: false });

      if (formId) {
        query = query.eq('form_id', formId);
      }

      if (placementId) {
        query = query.eq('placement_id', placementId);
      }

      if (dateRange) {
        query = query
          .gte('created_at', dateRange.start)
          .lte('created_at', dateRange.end);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching form analytics:', error);
        throw error;
      }

      return data as FormResponseAnalytics[];
    },
  });
};

// Form Analytics Summary
export const useFormAnalyticsSummary = (formId: string, dateRange?: { start: string; end: string }) => {
  return useQuery({
    queryKey: ['form-analytics-summary', formId, dateRange],
    queryFn: async () => {
      let query = supabase
        .from('form_response_analytics')
        .select('event_type')
        .eq('form_id', formId);

      if (dateRange) {
        query = query
          .gte('created_at', dateRange.start)
          .lte('created_at', dateRange.end);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching form analytics summary:', error);
        throw error;
      }

      // Calculate summary metrics
      const summary = {
        total_views: data?.filter(item => item.event_type === 'form_view').length || 0,
        total_starts: data?.filter(item => item.event_type === 'form_start').length || 0,
        total_submissions: data?.filter(item => item.event_type === 'form_submit').length || 0,
        total_abandons: data?.filter(item => item.event_type === 'form_abandon').length || 0,
      };

      // Calculate conversion rates
      const conversion_rate = summary.total_views > 0 
        ? ((summary.total_submissions / summary.total_views) * 100).toFixed(2)
        : '0';

      const completion_rate = summary.total_starts > 0
        ? ((summary.total_submissions / summary.total_starts) * 100).toFixed(2)
        : '0';

      const abandon_rate = summary.total_starts > 0
        ? ((summary.total_abandons / summary.total_starts) * 100).toFixed(2)
        : '0';

      return {
        ...summary,
        conversion_rate: parseFloat(conversion_rate),
        completion_rate: parseFloat(completion_rate),
        abandon_rate: parseFloat(abandon_rate),
      };
    },
  });
};

// Track Form Analytics Event
export const useTrackFormEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventData: FormResponseAnalyticsInsert) => {
      const { data, error } = await supabase
        .from('form_response_analytics')
        .insert(eventData)
        .select()
        .single();

      if (error) {
        console.error('Error tracking form event:', error);
        throw error;
      }

      return data as FormResponseAnalytics;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form-analytics'] });
      queryClient.invalidateQueries({ queryKey: ['form-analytics-summary'] });
    },
  });
};

// Form Performance Analytics by Date
export const useFormPerformanceAnalytics = (formId: string, days: number = 30) => {
  return useQuery({
    queryKey: ['form-performance-analytics', formId, days],
    queryFn: async () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);

      const { data, error } = await supabase
        .from('form_response_analytics')
        .select('event_type, created_at')
        .eq('form_id', formId)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching form performance analytics:', error);
        throw error;
      }

      // Group data by date
      const dailyMetrics: Record<string, any> = {};

      data?.forEach(event => {
        const date = new Date(event.created_at).toDateString();
        if (!dailyMetrics[date]) {
          dailyMetrics[date] = {
            date,
            views: 0,
            starts: 0,
            submissions: 0,
            abandons: 0,
          };
        }

        switch (event.event_type) {
          case 'form_view':
            dailyMetrics[date].views++;
            break;
          case 'form_start':
            dailyMetrics[date].starts++;
            break;
          case 'form_submit':
            dailyMetrics[date].submissions++;
            break;
          case 'form_abandon':
            dailyMetrics[date].abandons++;
            break;
        }
      });

      return Object.values(dailyMetrics);
    },
  });
};
