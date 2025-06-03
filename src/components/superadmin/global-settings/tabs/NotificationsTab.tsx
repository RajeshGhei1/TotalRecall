
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useSystemNotifications, useCreateSystemNotification, useUpdateSystemNotification, useDeleteSystemNotification } from '@/hooks/global-settings/useSystemNotifications';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Bell, Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const NotificationsTab: React.FC = () => {
  const { data: notifications, isLoading } = useSystemNotifications();
  const createNotification = useCreateSystemNotification();
  const updateNotification = useUpdateSystemNotification();
  const deleteNotification = useDeleteSystemNotification();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    priority: 0,
    starts_at: '',
    ends_at: '',
    target_users: ['all'],
    is_active: true
  });

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      type: 'info',
      priority: 0,
      starts_at: '',
      ends_at: '',
      target_users: ['all'],
      is_active: true
    });
    setEditingId(null);
    setShowCreateForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      starts_at: formData.starts_at ? new Date(formData.starts_at).toISOString() : undefined,
      ends_at: formData.ends_at ? new Date(formData.ends_at).toISOString() : undefined,
    };

    if (editingId) {
      await updateNotification.mutateAsync({
        id: editingId,
        updates: payload
      });
    } else {
      await createNotification.mutateAsync(payload);
    }
    
    resetForm();
  };

  const handleEdit = (notification: any) => {
    setFormData({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      priority: notification.priority,
      starts_at: notification.starts_at ? new Date(notification.starts_at).toISOString().slice(0, 16) : '',
      ends_at: notification.ends_at ? new Date(notification.ends_at).toISOString().slice(0, 16) : '',
      target_users: notification.target_users || ['all'],
      is_active: notification.is_active
    });
    setEditingId(notification.id);
    setShowCreateForm(true);
  };

  const getTypeBadge = (type: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      info: 'default',
      warning: 'secondary',
      error: 'destructive',
      success: 'default'
    };
    
    return <Badge variant={variants[type] || 'default'}>{type}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                System Notifications
              </CardTitle>
              <CardDescription>
                Manage system-wide notifications and announcements
              </CardDescription>
            </div>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Notification
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showCreateForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">
                  {editingId ? 'Edit Notification' : 'Create New Notification'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="info">Info</SelectItem>
                          <SelectItem value="warning">Warning</SelectItem>
                          <SelectItem value="error">Error</SelectItem>
                          <SelectItem value="success">Success</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Input
                        id="priority"
                        type="number"
                        value={formData.priority}
                        onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                        min="0"
                        max="10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="starts_at">Start Time (Optional)</Label>
                      <Input
                        id="starts_at"
                        type="datetime-local"
                        value={formData.starts_at}
                        onChange={(e) => setFormData(prev => ({ ...prev, starts_at: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ends_at">End Time (Optional)</Label>
                      <Input
                        id="ends_at"
                        type="datetime-local"
                        value={formData.ends_at}
                        onChange={(e) => setFormData(prev => ({ ...prev, ends_at: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Active</Label>
                      <p className="text-sm text-muted-foreground">
                        Whether this notification is currently active
                      </p>
                    </div>
                    <Switch
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={createNotification.isPending || updateNotification.isPending}>
                      {(createNotification.isPending || updateNotification.isPending) && (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      )}
                      {editingId ? 'Update' : 'Create'}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notifications?.map((notification) => (
                  <TableRow key={notification.id}>
                    <TableCell className="font-medium">{notification.title}</TableCell>
                    <TableCell>{getTypeBadge(notification.type)}</TableCell>
                    <TableCell>{notification.priority}</TableCell>
                    <TableCell>
                      <Badge variant={notification.is_active ? 'default' : 'secondary'}>
                        {notification.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(new Date(notification.created_at), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(notification)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteNotification.mutate(notification.id)}
                          disabled={deleteNotification.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {(!notifications || notifications.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No notifications found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsTab;
