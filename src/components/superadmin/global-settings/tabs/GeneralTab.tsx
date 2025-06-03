
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGlobalSettings, useUpdateGlobalSetting, useCreateGlobalSetting } from '@/hooks/global-settings/useGlobalSettings';
import { Loader2, Save } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const GeneralTab: React.FC = () => {
  const [user, setUser] = React.useState<any>(null);
  const { data: settings, isLoading } = useGlobalSettings('general');
  const updateSetting = useUpdateGlobalSetting();
  const createSetting = useCreateGlobalSetting();
  const [formData, setFormData] = useState<Record<string, any>>({
    system_name: 'Total Recall AI',
    system_timezone: 'UTC',
    max_file_upload_size: 10485760 // 10MB in bytes
  });
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  React.useEffect(() => {
    if (settings && settings.length > 0) {
      const initialData = settings.reduce((acc, setting) => {
        acc[setting.setting_key] = setting.setting_value;
        return acc;
      }, {} as Record<string, any>);
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [settings]);

  const handleSave = async () => {
    if (!user?.id) {
      toast({
        title: 'Error',
        description: 'You must be logged in to save settings.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      // Define the settings we want to save
      const settingsToSave = [
        {
          key: 'system_name',
          value: formData.system_name,
          type: 'string',
          description: 'The display name of the system'
        },
        {
          key: 'system_timezone',
          value: formData.system_timezone,
          type: 'string',
          description: 'Default timezone for the system'
        },
        {
          key: 'max_file_upload_size',
          value: formData.max_file_upload_size,
          type: 'number',
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
            setting_type: settingToSave.type as 'string' | 'number' | 'boolean' | 'json',
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
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="system_name">System Name</Label>
              <Input
                id="system_name"
                value={formData.system_name || ''}
                onChange={(e) => handleInputChange('system_name', e.target.value)}
                placeholder="Total Recall AI"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="system_timezone">Default Timezone</Label>
              <Select
                value={formData.system_timezone || 'UTC'}
                onValueChange={(value) => handleInputChange('system_timezone', value)}
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
            <Label htmlFor="max_file_upload_size">Max File Upload Size (MB)</Label>
            <Input
              id="max_file_upload_size"
              type="number"
              value={Math.round((formData.max_file_upload_size || 10485760) / 1024 / 1024)}
              onChange={(e) => handleInputChange('max_file_upload_size', parseInt(e.target.value) * 1024 * 1024)}
              min="1"
              max="100"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={handleSave}
          disabled={isSaving || isLoading}
          className="flex items-center gap-2"
        >
          {isSaving ? (
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

export default GeneralTab;
