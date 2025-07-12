
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useSystemMaintenance, useCreateSystemMaintenance, useUpdateSystemMaintenance } from '@/hooks/global-settings/useMaintenanceMode';
import { useGlobalSettings, useUpdateGlobalSetting } from '@/hooks/global-settings/useGlobalSettings';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Wrench, Plus, Calendar, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

type MaintenanceType = 'scheduled' | 'emergency' | 'update';

const MaintenanceTab: React.FC = () => {
  const [user, setUser] = React.useState<unknown>(null);
  const { data: maintenanceRecords, isLoading: maintenanceLoading } = useSystemMaintenance();
  const { data: settings } = useGlobalSettings('maintenance');
  const updateSetting = useUpdateGlobalSetting();
  const createMaintenance = useCreateSystemMaintenance();
  const updateMaintenance = useUpdateSystemMaintenance();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    maintenance_type: 'scheduled' as MaintenanceType,
    scheduled_start: '',
    scheduled_end: '',
    affected_services: [] as string[]
  });

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const maintenanceMode = settings?.find(s => s.setting_key === 'maintenance_mode')?.setting_value || false;

  const handleMaintenanceModeToggle = async (enabled: boolean) => {
    if (!user?.id) return;
    
    const setting = settings?.find(s => s.setting_key === 'maintenance_mode');
    if (setting) {
      await updateSetting.mutateAsync({
        id: setting.id,
        setting_value: enabled,
        updated_by: user.id
      });
    }
  };

  const handleCreateMaintenance = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createMaintenance.mutateAsync({
      ...formData,
      scheduled_start: new Date(formData.scheduled_start).toISOString(),
      scheduled_end: new Date(formData.scheduled_end).toISOString(),
      status: 'planned',
      notification_sent: false
    });
    
    setShowCreateForm(false);
    setFormData({
      title: '',
      description: '',
      maintenance_type: 'scheduled',
      scheduled_start: '',
      scheduled_end: '',
      affected_services: []
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      planned: 'secondary',
      in_progress: 'default',
      completed: 'default',
      cancelled: 'destructive'
    };
    
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  if (maintenanceLoading) {
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
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Maintenance Mode
          </CardTitle>
          <CardDescription>
            Enable or disable system-wide maintenance mode
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Maintenance Mode</Label>
              <p className="text-sm text-muted-foreground">
                When enabled, users will see a maintenance message
              </p>
            </div>
            <Switch
              checked={maintenanceMode}
              onCheckedChange={handleMaintenanceModeToggle}
              disabled={updateSetting.isPending}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Scheduled Maintenance
              </CardTitle>
              <CardDescription>
                Schedule and manage maintenance windows
              </CardDescription>
            </div>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Maintenance
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showCreateForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Schedule New Maintenance</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateMaintenance} className="space-y-4">
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
                      <Label htmlFor="maintenance_type">Type</Label>
                      <Select
                        value={formData.maintenance_type}
                        onValueChange={(value: MaintenanceType) => setFormData(prev => ({ ...prev, maintenance_type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="emergency">Emergency</SelectItem>
                          <SelectItem value="update">Update</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="scheduled_start">Start Time</Label>
                      <Input
                        id="scheduled_start"
                        type="datetime-local"
                        value={formData.scheduled_start}
                        onChange={(e) => setFormData(prev => ({ ...prev, scheduled_start: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="scheduled_end">End Time</Label>
                      <Input
                        id="scheduled_end"
                        type="datetime-local"
                        value={formData.scheduled_end}
                        onChange={(e) => setFormData(prev => ({ ...prev, scheduled_end: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={createMaintenance.isPending}>
                      {createMaintenance.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Schedule
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
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
                  <TableHead>Status</TableHead>
                  <TableHead>Scheduled Start</TableHead>
                  <TableHead>Scheduled End</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {maintenanceRecords?.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.title}</TableCell>
                    <TableCell>{record.maintenance_type}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(record.scheduled_start), 'MMM dd, yyyy')}
                        <Clock className="h-4 w-4 ml-2" />
                        {format(new Date(record.scheduled_start), 'HH:mm')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(record.scheduled_end), 'MMM dd, yyyy')}
                        <Clock className="h-4 w-4 ml-2" />
                        {format(new Date(record.scheduled_end), 'HH:mm')}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {(!maintenanceRecords || maintenanceRecords.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No maintenance records found
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

export default MaintenanceTab;
