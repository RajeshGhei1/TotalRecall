
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useRealTimeCollaboration } from '@/hooks/collaboration/useRealTimeCollaboration';
import { Users, Bell, AlertTriangle, Eye, Edit, Coffee } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Type definitions for collaboration
interface Conflict {
  type: string;
  field: string;
  userId: string;
  timestamp: string;
  data: Record<string, unknown>;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  notification_type: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  is_read: boolean;
  created_at: string;
  data: {
    conflicts?: Conflict[];
    [key: string]: unknown;
  };
}

interface CollaborationPanelProps {
  entityType: 'form' | 'report';
  entityId: string;
  currentSection?: string;
  onConflictDetected?: (conflicts: Conflict[]) => void;
}

const CollaborationPanel: React.FC<CollaborationPanelProps> = ({
  entityType,
  entityId,
  currentSection,
  onConflictDetected,
}) => {
  const {
    useActiveSessions,
    useNotifications,
    updatePresence,
    markAsRead,
    sendNotification,
  } = useRealTimeCollaboration(entityType, entityId);

  const { data: activeSessions } = useActiveSessions();
  const { data: notifications } = useNotifications();
  const [userStatus, setUserStatus] = useState<'active' | 'away' | 'editing'>('active');

  const unreadNotifications = notifications?.filter(n => !n.is_read) || [];
  const conflictNotifications = notifications?.filter(n => n.notification_type === 'conflict_warning') || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'editing': return <Edit className="h-3 w-3" />;
      case 'away': return <Coffee className="h-3 w-3" />;
      default: return <Eye className="h-3 w-3" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'editing': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const handleStatusChange = (newStatus: 'active' | 'away' | 'editing') => {
    setUserStatus(newStatus);
    updatePresence.mutate({
      status: newStatus,
      currentSection,
    });
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      await markAsRead.mutateAsync(notification.id);
    }
    
    if (notification.notification_type === 'conflict_warning') {
      onConflictDetected?.(notification.data.conflicts || []);
    }
  };

  useEffect(() => {
    if (conflictNotifications.length > 0) {
      const conflicts = conflictNotifications.flatMap(n => n.data.conflicts || []);
      onConflictDetected?.(conflicts);
    }
  }, [conflictNotifications, onConflictDetected]);

  return (
    <div className="space-y-4">
      {/* Active Users */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4" />
            Active Users ({activeSessions?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeSessions?.map((session) => (
              <div key={session.id} className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://avatar.vercel.sh/${session.profiles?.email}`} />
                    <AvatarFallback className="text-xs">
                      {session.profiles?.full_name?.[0] || session.profiles?.email?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(session.status)}`}>
                    <div className="flex items-center justify-center h-full w-full text-white">
                      {getStatusIcon(session.status)}
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {session.profiles?.full_name || session.profiles?.email}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="capitalize">{session.status}</span>
                    {session.current_section && (
                      <>
                        <span>•</span>
                        <span>{session.current_section}</span>
                      </>
                    )}
                  </div>
                </div>
                
                <Badge variant="outline" className="text-xs">
                  {formatDistanceToNow(new Date(session.last_seen), { addSuffix: true })}
                </Badge>
              </div>
            ))}
            
            {(!activeSessions || activeSessions.length === 0) && (
              <div className="text-center py-4 text-gray-500">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No other users online</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* User Status Control */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Your Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant={userStatus === 'active' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStatusChange('active')}
            >
              <Eye className="h-3 w-3 mr-1" />
              Active
            </Button>
            <Button
              variant={userStatus === 'editing' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStatusChange('editing')}
            >
              <Edit className="h-3 w-3 mr-1" />
              Editing
            </Button>
            <Button
              variant={userStatus === 'away' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStatusChange('away')}
            >
              <Coffee className="h-3 w-3 mr-1" />
              Away
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Bell className="h-4 w-4" />
            Notifications
            {unreadNotifications.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadNotifications.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-48">
            <div className="space-y-3">
              {notifications?.slice(0, 10).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    notification.is_read 
                      ? 'border-gray-200 bg-gray-50' 
                      : 'border-blue-200 bg-blue-50'
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`h-2 w-2 rounded-full mt-2 ${getPriorityColor(notification.priority)}`} />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium">{notification.title}</p>
                        {notification.notification_type === 'conflict_warning' && (
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                        )}
                      </div>
                      
                      <p className="text-xs text-gray-600 mb-1">{notification.message}</p>
                      
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {(!notifications || notifications.length === 0) && (
                <div className="text-center py-4 text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No notifications</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default CollaborationPanel;
