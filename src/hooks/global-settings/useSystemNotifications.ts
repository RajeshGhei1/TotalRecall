
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  is_active: boolean;
  priority: number;
  starts_at?: string;
  ends_at?: string;
  target_users: string[];
  created_at: string;
  updated_at: string;
}

export const useSystemNotifications = () => {
  return useQuery({
    queryKey: ['system-notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_notifications')
        .select('*')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as SystemNotification[];
    },
  });
};

export const useActiveSystemNotifications = () => {
  return useQuery({
    queryKey: ['active-system-notifications'],
    queryFn: async () => {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('system_notifications')
        .select('*')
        .eq('is_active', true)
        .or(`starts_at.is.null,starts_at.lte.${now}`)
        .or(`ends_at.is.null,ends_at.gte.${now}`)
        .order('priority', { ascending: false });

      if (error) throw error;
      return data as SystemNotification[];
    },
    refetchInterval: 60000, // Refetch every minute
  });
};

export const useCreateSystemNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notification: Omit<SystemNotification, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('system_notifications')
        .insert(notification)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-notifications'] });
      toast({
        title: 'Notification Created',
        description: 'System notification has been created successfully.',
      });
    },
    onError: (error) => {
      console.error('Failed to create system notification:', error);
      toast({
        title: 'Creation Failed',
        description: 'Failed to create system notification.',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateSystemNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      updates 
    }: { 
      id: string; 
      updates: Partial<SystemNotification>;
    }) => {
      const { data, error } = await supabase
        .from('system_notifications')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-notifications'] });
      toast({
        title: 'Notification Updated',
        description: 'System notification has been updated successfully.',
      });
    },
  });
};

export const useDeleteSystemNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('system_notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-notifications'] });
      toast({
        title: 'Notification Deleted',
        description: 'System notification has been deleted successfully.',
      });
    },
  });
};
