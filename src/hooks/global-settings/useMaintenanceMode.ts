
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface SystemMaintenance {
  id: string;
  title: string;
  description?: string;
  maintenance_type: 'scheduled' | 'emergency' | 'update';
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  scheduled_start: string;
  scheduled_end: string;
  actual_start?: string;
  actual_end?: string;
  affected_services: string[];
  notification_sent: boolean;
  created_at: string;
  updated_at: string;
}

export const useSystemMaintenance = () => {
  return useQuery({
    queryKey: ['system-maintenance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_maintenance')
        .select('*')
        .order('scheduled_start', { ascending: false });

      if (error) throw error;
      return data as SystemMaintenance[];
    },
  });
};

export const useActiveMaintenanceMode = () => {
  return useQuery({
    queryKey: ['active-maintenance'],
    queryFn: async () => {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('system_maintenance')
        .select('*')
        .eq('status', 'in_progress')
        .lte('scheduled_start', now)
        .gte('scheduled_end', now)
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as SystemMaintenance | null;
    },
    refetchInterval: 30000,
  });
};

export const useCreateSystemMaintenance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (maintenance: Omit<SystemMaintenance, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('system_maintenance')
        .insert(maintenance)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-maintenance'] });
      toast({
        title: 'Maintenance Scheduled',
        description: 'System maintenance has been scheduled successfully.',
      });
    },
    onError: (error) => {
      console.error('Failed to schedule maintenance:', error);
      toast({
        title: 'Scheduling Failed',
        description: 'Failed to schedule system maintenance.',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateSystemMaintenance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      updates 
    }: { 
      id: string; 
      updates: Partial<SystemMaintenance>;
    }) => {
      const { data, error } = await supabase
        .from('system_maintenance')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-maintenance'] });
      toast({
        title: 'Maintenance Updated',
        description: 'System maintenance has been updated successfully.',
      });
    },
  });
};
