
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useGlobalSettings, useUpdateGlobalSetting } from '@/hooks/global-settings/useGlobalSettings';
import { Loader2, Save, Shield } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const SecurityTab: React.FC = () => {
  const [user, setUser] = React.useState<any>(null);
  const { data: settings, isLoading } = useGlobalSettings('security');
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

  const handleInputChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
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
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Password Requirements
          </CardTitle>
          <CardDescription>
            Configure password complexity and security requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password_min_length">Minimum Password Length</Label>
            <Input
              id="password_min_length"
              type="number"
              value={formData.password_min_length || 8}
              onChange={(e) => handleInputChange('password_min_length', parseInt(e.target.value))}
              min="6"
              max="32"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Uppercase Letters</Label>
                <p className="text-sm text-muted-foreground">Password must contain at least one uppercase letter</p>
              </div>
              <Switch
                checked={formData.password_require_uppercase || false}
                onCheckedChange={(checked) => handleInputChange('password_require_uppercase', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Lowercase Letters</Label>
                <p className="text-sm text-muted-foreground">Password must contain at least one lowercase letter</p>
              </div>
              <Switch
                checked={formData.password_require_lowercase || false}
                onCheckedChange={(checked) => handleInputChange('password_require_lowercase', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Numbers</Label>
                <p className="text-sm text-muted-foreground">Password must contain at least one number</p>
              </div>
              <Switch
                checked={formData.password_require_numbers || false}
                onCheckedChange={(checked) => handleInputChange('password_require_numbers', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Symbols</Label>
                <p className="text-sm text-muted-foreground">Password must contain at least one symbol (!@#$%^&*)</p>
              </div>
              <Switch
                checked={formData.password_require_symbols || false}
                onCheckedChange={(checked) => handleInputChange('password_require_symbols', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session Management</CardTitle>
          <CardDescription>
            Configure user session and authentication settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="session_timeout">Session Timeout (seconds)</Label>
            <Input
              id="session_timeout"
              type="number"
              value={formData.session_timeout || 3600}
              onChange={(e) => handleInputChange('session_timeout', parseInt(e.target.value))}
              min="300"
              max="86400"
            />
            <p className="text-sm text-muted-foreground">
              Current: {Math.round((formData.session_timeout || 3600) / 60)} minutes
            </p>
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

export default SecurityTab;
