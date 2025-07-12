
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSecureQueryKey } from '@/hooks/security/useSecureQueryKey';
import { useAuth } from '@/contexts/AuthContext';

interface RealTimeSession {
  id: string;
  user_id: string;
  session_id: string;
  entity_type: 'form' | 'report';
  entity_id: string;
  joined_at: string;
  last_seen: string;
  status: 'active' | 'away' | 'editing';
  cursor_position?: any;
  current_section?: string;
  metadata: unknown;
  profiles?: {
    id: string;
    email: string;
    full_name?: string;
  };
}

interface RealTimeNotification {
  id: string;
  recipient_id: string;
  sender_id?: string;
  notification_type: 'change_detected' | 'conflict_warning' | 'approval_request' | 'version_published' | 'user_joined' | 'user_left';
  entity_type: 'form' | 'report';
  entity_id: string;
  title: string;
  message: string;
  data: unknown;
  is_read: boolean;
  created_at: string;
  expires_at?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

/**
 * Real-time collaboration hook for concurrent editing and notifications
 */
export const useRealTimeCollaboration = (entityType: 'form' | 'report', entityId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { createSecureKey } = useSecureQueryKey();
  
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random()}`);
  const [activeUsers, setActiveUsers] = useState<RealTimeSession[]>([]);
  const [notifications, setNotifications] = useState<RealTimeNotification[]>([]);
  const [conflictWarnings, setConflictWarnings] = useState<Map<string, any>>(new Map());

  // Join collaboration session
  const joinSession = useMutation({
    mutationFn: async (params: {
      status?: 'active' | 'away' | 'editing';
      currentSection?: string;
      metadata?: any;
    }) => {
      const { status = 'active', currentSection, metadata = {} } = params;
      
      const { data, error } = await supabase
        .from('real_time_sessions')
        .upsert({
          user_id: user?.id,
          session_id: sessionId,
          entity_type: entityType,
          entity_id: entityId,
          status,
          current_section: currentSection,
          metadata,
          last_seen: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Send notification to other users
      sendNotification.mutate({
        type: 'user_joined',
        title: 'User Joined',
        message: `${user?.email} joined the session`,
        data: { sessionId },
      });
    },
  });

  // Leave collaboration session
  const leaveSession = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('real_time_sessions')
        .delete()
        .eq('user_id', user?.id)
        .eq('session_id', sessionId)
        .eq('entity_type', entityType)
        .eq('entity_id', entityId);

      if (error) throw error;
    },
    onSuccess: () => {
      // Send notification to other users
      sendNotification.mutate({
        type: 'user_left',
        title: 'User Left',
        message: `${user?.email} left the session`,
        data: { sessionId },
      });
    },
  });

  // Update user status/presence
  const updatePresence = useMutation({
    mutationFn: async (params: {
      status: 'active' | 'away' | 'editing';
      cursorPosition?: any;
      currentSection?: string;
    }) => {
      const { status, cursorPosition, currentSection } = params;
      
      const { data, error } = await supabase
        .from('real_time_sessions')
        .update({
          status,
          cursor_position: cursorPosition,
          current_section: currentSection,
          last_seen: new Date().toISOString(),
        })
        .eq('user_id', user?.id)
        .eq('session_id', sessionId)
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Send real-time notification
  const sendNotification = useMutation({
    mutationFn: async (params: {
      type: RealTimeNotification['notification_type'];
      title: string;
      message: string;
      data?: any;
      priority?: 'low' | 'medium' | 'high' | 'urgent';
      recipientIds?: string[];
    }) => {
      const { type, title, message, data = {}, priority = 'medium', recipientIds } = params;
      
      // If no specific recipients, send to all active users in the session
      let recipients = recipientIds;
      if (!recipients) {
        const { data: sessions } = await supabase
          .from('real_time_sessions')
          .select('user_id')
          .eq('entity_type', entityType)
          .eq('entity_id', entityId)
          .neq('user_id', user?.id);
        
        recipients = sessions?.map(s => s.user_id) || [];
      }

      // Send notification to each recipient
      const notifications = recipients.map(recipientId => ({
        recipient_id: recipientId,
        sender_id: user?.id,
        notification_type: type,
        entity_type: entityType,
        entity_id: entityId,
        title,
        message,
        data,
        priority,
      }));

      const { data: notificationData, error } = await supabase
        .from('real_time_notifications')
        .insert(notifications)
        .select();

      if (error) throw error;
      return notificationData;
    },
  });

  // Get active sessions
  const useActiveSessions = () => {
    return useQuery({
      queryKey: createSecureKey('active-sessions', [entityType, entityId]),
      queryFn: async () => {
        const { data, error } = await supabase
          .from('real_time_sessions')
          .select(`
            *,
            profiles:user_id (
              id,
              email,
              full_name
            )
          `)
          .eq('entity_type', entityType)
          .eq('entity_id', entityId)
          .gt('last_seen', new Date(Date.now() - 5 * 60 * 1000).toISOString()) // Active in last 5 minutes
          .order('last_seen', { ascending: false });

        if (error) throw error;
        return data as RealTimeSession[];
      },
      refetchInterval: 10000, // Refetch every 10 seconds
    });
  };

  // Get user notifications
  const useNotifications = () => {
    return useQuery({
      queryKey: createSecureKey('real-time-notifications', [entityType, entityId]),
      queryFn: async () => {
        const { data, error } = await supabase
          .from('real_time_notifications')
          .select('*')
          .eq('recipient_id', user?.id)
          .eq('entity_type', entityType)
          .eq('entity_id', entityId)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;
        return data as RealTimeNotification[];
      },
      enabled: !!user?.id,
    });
  };

  // Mark notification as read
  const markAsRead = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('real_time_notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: createSecureKey('real-time-notifications')
      });
    },
  });

  // Detect conflicts when multiple users are editing
  const detectConflicts = useCallback((currentData: unknown, incomingData: unknown) => {
    const conflicts: unknown[] = [];
    
    // Simple conflict detection - can be enhanced based on specific needs
    if (JSON.stringify(currentData) !== JSON.stringify(incomingData)) {
      conflicts.push({
        type: 'data_conflict',
        message: 'Another user has made changes to this entity',
        timestamp: new Date().toISOString(),
      });
    }
    
    return conflicts;
  }, []);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user?.id || !entityId) return;

    // Subscribe to session changes
    const sessionsChannel = supabase
      .channel(`sessions-${entityType}-${entityId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'real_time_sessions',
          filter: `entity_type=eq.${entityType}&entity_id=eq.${entityId}`,
        },
        (payload) => {
          queryClient.invalidateQueries({
            queryKey: createSecureKey('active-sessions', [entityType, entityId])
          });
          
          if (payload.eventType === 'INSERT' && payload.new.user_id !== user.id) {
            toast({
              title: 'User Joined',
              description: `Another user joined the collaboration session`,
            });
          }
        }
      )
      .subscribe();

    // Subscribe to notification changes
    const notificationsChannel = supabase
      .channel(`notifications-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'real_time_notifications',
          filter: `recipient_id=eq.${user.id}&entity_type=eq.${entityType}&entity_id=eq.${entityId}`,
        },
        (payload) => {
          const notification = payload.new as RealTimeNotification;
          
          queryClient.invalidateQueries({
            queryKey: createSecureKey('real-time-notifications')
          });
          
          // Show toast for important notifications
          if (notification.priority === 'high' || notification.priority === 'urgent') {
            toast({
              title: notification.title,
              description: notification.message,
              variant: notification.notification_type === 'conflict_warning' ? 'destructive' : 'default',
            });
          }
        }
      )
      .subscribe();

    // Cleanup on unmount
    return () => {
      leaveSession.mutate();
      supabase.removeChannel(sessionsChannel);
      supabase.removeChannel(notificationsChannel);
    };
  }, [user?.id, entityType, entityId]);

  // Join session on mount
  useEffect(() => {
    if (user?.id && entityId) {
      joinSession.mutate({});
    }
  }, [user?.id, entityId]);

  // Update last seen periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (user?.id && entityId) {
        updatePresence.mutate({ status: 'active' });
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [user?.id, entityId]);

  return {
    useActiveSessions,
    useNotifications,
    joinSession,
    leaveSession,
    updatePresence,
    sendNotification,
    markAsRead,
    detectConflicts,
    conflictWarnings: Array.from(conflictWarnings.values()),
    isJoining: joinSession.isPending,
    isLeaving: leaveSession.isPending,
    isSendingNotification: sendNotification.isPending,
  };
};
