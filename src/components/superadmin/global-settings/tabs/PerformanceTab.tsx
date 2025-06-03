
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useGlobalSettings, useUpdateGlobalSetting } from '@/hooks/global-settings/useGlobalSettings';
import { Loader2, Save, Gauge } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const PerformanceTab: React.FC = () => {
  const [user, setUser] = React.useState<any>(null);
  const { data: settings, isLoading } = useGlobalSettings('performance');
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
            <Gauge className="h-5 w-5" />
            API Rate Limiting
          </CardTitle>
          <CardDescription>
            Configure API request limits and throttling
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rate_limit_requests_per_minute">Requests per Minute (per user)</Label>
            <Input
              id="rate_limit_requests_per_minute"
              type="number"
              value={formData.rate_limit_requests_per_minute || 100}
              onChange={(e) => handleInputChange('rate_limit_requests_per_minute', parseInt(e.target.value))}
              min="10"
              max="1000"
            />
            <p className="text-sm text-muted-foreground">
              Maximum API requests a user can make per minute
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Caching Configuration</CardTitle>
          <CardDescription>
            Configure system caching and performance optimization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cache_ttl_default">Default Cache TTL (seconds)</Label>
            <Input
              id="cache_ttl_default"
              type="number"
              value={formData.cache_ttl_default || 300}
              onChange={(e) => handleInputChange('cache_ttl_default', parseInt(e.target.value))}
              min="30"
              max="3600"
            />
            <p className="text-sm text-muted-foreground">
              Current: {Math.round((formData.cache_ttl_default || 300) / 60)} minutes
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

export default PerformanceTab;
