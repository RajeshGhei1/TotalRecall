
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useGlobalSettings, useUpdateGlobalSetting, useCreateGlobalSetting } from '@/hooks/global-settings/useGlobalSettings';
import { Loader2, Save, Gauge } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface FormData {
  rate_limit_requests_per_minute: number;
  cache_ttl_default: number;
}

const DEFAULT_VALUES: FormData = {
  rate_limit_requests_per_minute: 100,
  cache_ttl_default: 300
};

const PerformanceTab: React.FC = () => {
  const [user, setUser] = React.useState<unknown>(null);
  const { data: settings, isLoading: isLoadingSettings } = useGlobalSettings('performance');
  const updateSetting = useUpdateGlobalSetting();
  const createSetting = useCreateGlobalSetting();
  const [formData, setFormData] = useState<FormData>(DEFAULT_VALUES);
  const [isSaving, setIsSaving] = useState(false);

  // Get current user
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  // Load settings into form when data is available
  useEffect(() => {
    if (settings && settings.length > 0) {
      const settingsMap = settings.reduce((acc, setting) => {
        acc[setting.setting_key] = setting.setting_value;
        return acc;
      }, {} as Record<string, unknown>);

      setFormData(prev => ({
        rate_limit_requests_per_minute: settingsMap.rate_limit_requests_per_minute !== undefined 
          ? Number(settingsMap.rate_limit_requests_per_minute) 
          : prev.rate_limit_requests_per_minute,
        cache_ttl_default: settingsMap.cache_ttl_default !== undefined 
          ? Number(settingsMap.cache_ttl_default) 
          : prev.cache_ttl_default
      }));
    }
  }, [settings]);

  const validateForm = (): boolean => {
    if (formData.rate_limit_requests_per_minute < 10 || formData.rate_limit_requests_per_minute > 1000) {
      toast({
        title: 'Validation Error',
        description: 'Rate limit must be between 10 and 1000 requests per minute.',
        variant: 'destructive',
      });
      return false;
    }

    if (formData.cache_ttl_default < 30 || formData.cache_ttl_default > 3600) {
      toast({
        title: 'Validation Error',
        description: 'Cache TTL must be between 30 and 3600 seconds.',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!user?.id) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to save settings.',
        variant: 'destructive',
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    
    try {
      const settingsToSave = [
        {
          key: 'rate_limit_requests_per_minute',
          value: formData.rate_limit_requests_per_minute,
          type: 'number' as const,
          description: 'Maximum API requests a user can make per minute'
        },
        {
          key: 'cache_ttl_default',
          value: formData.cache_ttl_default,
          type: 'number' as const,
          description: 'Default cache TTL in seconds'
        }
      ];

      // Process each setting
      for (const settingToSave of settingsToSave) {
        const existingSetting = settings?.find(s => s.setting_key === settingToSave.key);
        
        if (existingSetting) {
          // Update existing setting
          await updateSetting.mutateAsync({
            id: existingSetting.id,
            setting_value: settingToSave.value,
            updated_by: user.id
          });
        } else {
          // Create new setting
          await createSetting.mutateAsync({
            setting_key: settingToSave.key,
            setting_value: settingToSave.value,
            setting_type: settingToSave.type,
            category: 'performance',
            description: settingToSave.description,
            is_sensitive: false
          });
        }
      }

      toast({
        title: 'Success',
        description: 'Performance settings saved successfully.',
      });
    } catch (error) {
      console.error('Failed to save performance settings:', error);
      toast({
        title: 'Save Failed',
        description: error instanceof Error ? error.message : 'Failed to save performance settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (key: keyof FormData, value: number) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const isLoading = isLoadingSettings;
  const isBusy = isSaving || updateSetting.isPending || createSetting.isPending;

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
          {isLoading ? (
            <div className="h-8 bg-gray-200 rounded animate-pulse" />
          ) : (
            <div className="space-y-2">
              <Label htmlFor="rate_limit_requests_per_minute">Requests per Minute (per user) *</Label>
              <Input
                id="rate_limit_requests_per_minute"
                type="number"
                value={formData.rate_limit_requests_per_minute}
                onChange={(e) => handleInputChange('rate_limit_requests_per_minute', parseInt(e.target.value))}
                min="10"
                max="1000"
                disabled={isBusy}
              />
              <p className="text-sm text-muted-foreground">
                Maximum API requests a user can make per minute (10-1000)
              </p>
            </div>
          )}
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
          {isLoading ? (
            <div className="h-8 bg-gray-200 rounded animate-pulse" />
          ) : (
            <div className="space-y-2">
              <Label htmlFor="cache_ttl_default">Default Cache TTL (seconds) *</Label>
              <Input
                id="cache_ttl_default"
                type="number"
                value={formData.cache_ttl_default}
                onChange={(e) => handleInputChange('cache_ttl_default', parseInt(e.target.value))}
                min="30"
                max="3600"
                disabled={isBusy}
              />
              <p className="text-sm text-muted-foreground">
                Current: {Math.round(formData.cache_ttl_default / 60)} minutes (30-3600 seconds)
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={handleSave}
          disabled={isBusy || isLoading}
          className="flex items-center gap-2"
        >
          {isBusy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isBusy ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

export default PerformanceTab;
