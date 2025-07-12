
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGlobalSettings, useUpdateGlobalSetting, useCreateGlobalSetting } from '@/hooks/global-settings/useGlobalSettings';
import { Loader2, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface FormData {
  system_name: string;
  system_timezone: string;
  max_file_upload_size: number;
}

const DEFAULT_VALUES: FormData = {
  system_name: 'Total Recall AI',
  system_timezone: 'UTC',
  max_file_upload_size: 10485760 // 10MB in bytes
};

const GeneralTab: React.FC = () => {
  const [user, setUser] = React.useState<unknown>(null);
  const { data: settings, isLoading: isLoadingSettings } = useGlobalSettings('general');
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
        system_name: settingsMap.system_name || prev.system_name,
        system_timezone: settingsMap.system_timezone || prev.system_timezone,
        max_file_upload_size: settingsMap.max_file_upload_size || prev.max_file_upload_size
      }));
    }
  }, [settings]);

  const validateForm = (): boolean => {
    if (!formData.system_name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'System name is required.',
        variant: 'destructive',
      });
      return false;
    }

    const fileSizeMB = formData.max_file_upload_size / (1024 * 1024);
    if (fileSizeMB < 1 || fileSizeMB > 100) {
      toast({
        title: 'Validation Error',
        description: 'File upload size must be between 1 and 100 MB.',
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
          key: 'system_name',
          value: formData.system_name.trim(),
          type: 'string' as const,
          description: 'The display name of the system'
        },
        {
          key: 'system_timezone',
          value: formData.system_timezone,
          type: 'string' as const,
          description: 'Default timezone for the system'
        },
        {
          key: 'max_file_upload_size',
          value: formData.max_file_upload_size,
          type: 'number' as const,
          description: 'Maximum file upload size in bytes'
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
            category: 'general',
            description: settingToSave.description,
            is_sensitive: false
          });
        }
      }

      toast({
        title: 'Success',
        description: 'Settings saved successfully.',
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast({
        title: 'Save Failed',
        description: error instanceof Error ? error.message : 'Failed to save settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (key: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleFileSizeChange = (sizeInMB: string) => {
    const sizeInBytes = parseInt(sizeInMB) * 1024 * 1024;
    handleInputChange('max_file_upload_size', sizeInBytes);
  };

  const isLoading = isLoadingSettings;
  const isBusy = isSaving || updateSetting.isPending || createSetting.isPending;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>
            Configure basic system information and display settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 bg-gray-200 rounded animate-pulse" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="system_name">System Name *</Label>
                  <Input
                    id="system_name"
                    value={formData.system_name}
                    onChange={(e) => handleInputChange('system_name', e.target.value)}
                    placeholder="Total Recall AI"
                    disabled={isBusy}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="system_timezone">Default Timezone</Label>
                  <Select
                    value={formData.system_timezone}
                    onValueChange={(value) => handleInputChange('system_timezone', value)}
                    disabled={isBusy}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      <SelectItem value="Europe/London">London</SelectItem>
                      <SelectItem value="Europe/Paris">Paris</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                      <SelectItem value="Asia/Shanghai">Shanghai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="max_file_upload_size">Max File Upload Size (MB) *</Label>
                <Input
                  id="max_file_upload_size"
                  type="number"
                  value={Math.round(formData.max_file_upload_size / 1024 / 1024)}
                  onChange={(e) => handleFileSizeChange(e.target.value)}
                  min="1"
                  max="100"
                  disabled={isBusy}
                />
                <p className="text-sm text-muted-foreground">
                  Current: {Math.round(formData.max_file_upload_size / 1024 / 1024)} MB
                </p>
              </div>
            </>
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

export default GeneralTab;
