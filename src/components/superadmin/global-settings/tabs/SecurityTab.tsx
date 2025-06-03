
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useGlobalSettings, useUpdateGlobalSetting } from '@/hooks/global-settings/useGlobalSettings';
import { Loader2, Save, Shield, Lock, Clock } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';

const SecurityTab: React.FC = () => {
  const { user } = useAuthContext();
  const { data: settings, isLoading } = useGlobalSettings('security');
  const updateSetting = useUpdateGlobalSetting();
  const [formData, setFormData] = useState<Record<string, any>>({});

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
      console.error('Failed to save security settings:', error);
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
            <Clock className="h-5 w-5" />
            Session Management
          </CardTitle>
          <CardDescription>
            Configure user session timeouts and security policies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="session_timeout">Session Timeout (minutes)</Label>
            <Input
              id="session_timeout"
              type="number"
              value={Math.round((formData.session_timeout || 3600) / 60)}
              onChange={(e) => handleInputChange('session_timeout', parseInt(e.target.value) * 60)}
              min="5"
              max="1440"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Password Policies
          </CardTitle>
          <CardDescription>
            Set password complexity requirements for all users
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
              max="50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="password_require_uppercase">Require Uppercase</Label>
              <Switch
                id="password_require_uppercase"
                checked={formData.password_require_uppercase || false}
                onCheckedChange={(checked) => handleInputChange('password_require_uppercase', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="password_require_lowercase">Require Lowercase</Label>
              <Switch
                id="password_require_lowercase"
                checked={formData.password_require_lowercase || false}
                onCheckedChange={(checked) => handleInputChange('password_require_lowercase', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="password_require_numbers">Require Numbers</Label>
              <Switch
                id="password_require_numbers"
                checked={formData.password_require_numbers || false}
                onCheckedChange={(checked) => handleInputChange('password_require_numbers', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="password_require_symbols">Require Symbols</Label>
              <Switch
                id="password_require_symbols"
                checked={formData.password_require_symbols || false}
                onCheckedChange={(checked) => handleInputChange('password_require_symbols', checked)}
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
          Save Security Settings
        </Button>
      </div>
    </div>
  );
};

export default SecurityTab;
