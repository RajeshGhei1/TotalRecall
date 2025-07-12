
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useGlobalSettings, useUpdateGlobalSetting } from '@/hooks/global-settings/useGlobalSettings';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, Settings, Save, Loader2, UserCheck, UserX } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const UsersTab: React.FC = () => {
  const [user, setUser] = React.useState<unknown>(null);
  const { data: settings, isLoading: settingsLoading } = useGlobalSettings('users');
  const updateSetting = useUpdateGlobalSetting();
  const [formData, setFormData] = useState<Record<string, any>>({});

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  React.useEffect(() => {
    if (settings) {
      const initialData = settings.reduce((acc, setting) => {
        acc[setting.setting_key] = setting.setting_value;
        return acc;
      }, {} as Record<string, any>);
      setFormData(initialData);
    }
  }, [settings]);

  // Fetch user statistics
  const { data: userStats, isLoading: statsLoading } = useQuery({
    queryKey: ['user-statistics'],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('role, created_at');

      if (error) throw error;

      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const stats = {
        total: profiles.length,
        superAdmins: profiles.filter(p => p.role === 'super_admin').length,
        tenantAdmins: profiles.filter(p => p.role === 'tenant_admin').length,
        users: profiles.filter(p => p.role === 'user').length,
        newThisMonth: profiles.filter(p => new Date(p.created_at) >= thirtyDaysAgo).length,
        newThisWeek: profiles.filter(p => new Date(p.created_at) >= sevenDaysAgo).length,
        roleDistribution: profiles.reduce((acc, p) => {
          acc[p.role] = (acc[p.role] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };

      return stats;
    },
  });

  const handleSave = async () => {
    if (!user?.id || !settings) return;

    try {
      await Promise.all(
        settings.map(setting => {
          const newValue = formData[setting.setting_key];
          if (newValue !== setting.setting_value) {
            return updateSetting.mutateAsync({
              id: setting.id,
              setting_value: newValue,
              updated_by: user.id
            });
          }
          return Promise.resolve();
        })
      );
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const handleInputChange = (key: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  if (settingsLoading || statsLoading) {
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
            <Users className="h-5 w-5" />
            User Statistics
          </CardTitle>
          <CardDescription>
            Overview of user accounts and activity across the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{userStats.total}</p>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{userStats.newThisMonth}</p>
                    <p className="text-sm text-muted-foreground">New This Month</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <UserX className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold">{userStats.newThisWeek}</p>
                    <p className="text-sm text-muted-foreground">New This Week</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold">{userStats.superAdmins}</p>
                    <p className="text-sm text-muted-foreground">Super Admins</p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Role Distribution</CardTitle>
          <CardDescription>
            Breakdown of users by role across the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userStats && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Count</TableHead>
                    <TableHead>Percentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(userStats.roleDistribution).map(([role, count]) => (
                    <TableRow key={role}>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {role.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{count}</TableCell>
                      <TableCell>
                        {((count / userStats.total) * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Default User Settings</CardTitle>
          <CardDescription>
            Configure default settings for new user accounts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="default_user_role">Default User Role</Label>
            <Select
              value={formData.default_user_role || 'user'}
              onValueChange={(value) => handleInputChange('default_user_role', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select default role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="tenant_admin">Tenant Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="max_login_attempts">Max Login Attempts</Label>
            <Input
              id="max_login_attempts"
              type="number"
              value={formData.max_login_attempts || 5}
              onChange={(e) => handleInputChange('max_login_attempts', parseInt(e.target.value))}
              min="3"
              max="10"
            />
            <p className="text-sm text-muted-foreground">
              Number of failed login attempts before account lockout
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lockout_duration">Account Lockout Duration (minutes)</Label>
            <Input
              id="lockout_duration"
              type="number"
              value={formData.lockout_duration || 30}
              onChange={(e) => handleInputChange('lockout_duration', parseInt(e.target.value))}
              min="5"
              max="1440"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Email Verification</Label>
                <p className="text-sm text-muted-foreground">New users must verify their email before accessing the system</p>
              </div>
              <Switch
                checked={formData.require_email_verification || true}
                onCheckedChange={(checked) => handleInputChange('require_email_verification', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-approve New Users</Label>
                <p className="text-sm text-muted-foreground">Automatically approve new user registrations</p>
              </div>
              <Switch
                checked={formData.auto_approve_users || false}
                onCheckedChange={(checked) => handleInputChange('auto_approve_users', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow Self Registration</Label>
                <p className="text-sm text-muted-foreground">Allow users to register for accounts without admin approval</p>
              </div>
              <Switch
                checked={formData.allow_self_registration || true}
                onCheckedChange={(checked) => handleInputChange('allow_self_registration', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={handleSave}
          disabled={updateSetting.isPending}
          className="flex items-center gap-2"
        >
          {updateSetting.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default UsersTab;
