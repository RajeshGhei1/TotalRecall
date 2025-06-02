
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { UserSession, UserSessionFilters, SessionStats } from '@/types/user-sessions';

export const useUserSessions = (filters: UserSessionFilters = {}, page = 1, pageSize = 50) => {
  return useQuery({
    queryKey: ['user-sessions', filters, page, pageSize],
    queryFn: async () => {
      let query = supabase
        .from('user_sessions')
        .select(`
          *,
          profiles:user_id (
            id,
            email,
            full_name
          ),
          tenants:tenant_id (
            id,
            name
          )
        `)
        .order('login_at', { ascending: false });

      // Apply filters
      if (filters.user_id) {
        query = query.eq('user_id', filters.user_id);
      }
      if (filters.tenant_id) {
        query = query.eq('tenant_id', filters.tenant_id);
      }
      if (filters.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active);
      }
      if (filters.login_method) {
        query = query.eq('login_method', filters.login_method);
      }
      if (filters.date_from) {
        query = query.gte('login_at', filters.date_from);
      }
      if (filters.date_to) {
        query = query.lte('login_at', filters.date_to);
      }
      if (filters.search) {
        query = query.or(`ip_address.ilike.%${filters.search}%,user_agent.ilike.%${filters.search}%`);
      }

      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      return {
        data: data as UserSession[],
        count: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
        currentPage: page
      };
    },
  });
};

export const useUserSessionStats = () => {
  return useQuery({
    queryKey: ['user-session-stats'],
    queryFn: async () => {
      // Get stats for the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .gte('login_at', sevenDaysAgo.toISOString());

      if (error) throw error;

      // Calculate stats
      const totalSessions = data.length;
      const activeSessions = data.filter(session => session.is_active).length;
      const uniqueUsers = new Set(data.map(session => session.user_id)).size;

      // Calculate average session duration
      const completedSessions = data.filter(session => session.logout_at);
      const avgSessionDuration = completedSessions.length > 0
        ? completedSessions.reduce((acc, session) => {
            const duration = new Date(session.logout_at!).getTime() - new Date(session.login_at).getTime();
            return acc + duration;
          }, 0) / completedSessions.length / (1000 * 60) // Convert to minutes
        : 0;

      // Get sessions by day
      const sessionsByDay = data.reduce((acc, session) => {
        const date = new Date(session.login_at).toDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Get top devices (safely handle device_info)
      const deviceCounts = data.reduce((acc, session) => {
        let device = 'Unknown';
        
        // Safely extract device type from device_info
        if (session.device_info && typeof session.device_info === 'object' && session.device_info !== null) {
          const deviceInfo = session.device_info as Record<string, any>;
          device = deviceInfo.type || 'Unknown';
        }
        
        acc[device] = (acc[device] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topDevices = Object.entries(deviceCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([device, count]) => ({ device, count }));

      // Get top locations (based on IP)
      const locationCounts = data.reduce((acc, session) => {
        const location = session.ip_address || 'Unknown';
        const locationKey = String(location);
        acc[locationKey] = (acc[locationKey] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topLocations = Object.entries(locationCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([location, count]) => ({ location, count }));

      return {
        totalSessions,
        activeSessions,
        uniqueUsers,
        avgSessionDuration: Math.round(avgSessionDuration),
        topDevices,
        topLocations,
        sessionsByDay
      } as SessionStats;
    },
  });
};

export const useTerminateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      const { data, error } = await supabase
        .from('user_sessions')
        .update({ 
          is_active: false, 
          logout_at: new Date().toISOString() 
        })
        .eq('id', sessionId);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['user-session-stats'] });
      toast({
        title: 'Session Terminated',
        description: 'User session has been successfully terminated',
      });
    },
    onError: (error) => {
      console.error('Failed to terminate session:', error);
      toast({
        title: 'Error',
        description: 'Failed to terminate session',
        variant: 'destructive',
      });
    },
  });
};
