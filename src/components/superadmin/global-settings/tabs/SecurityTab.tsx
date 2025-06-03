
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useGlobalSettings, useUpdateGlobalSetting, useCreateGlobalSetting } from '@/hooks/global-settings/useGlobalSettings';
import { Loader2, Save, Shield, Clock, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { invalidatePasswordRequirementsCache } from '@/utils/passwordValidation';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SecurityFormData {
  password_min_length: number;
  password_require_uppercase: boolean;
  password_require_lowercase: boolean;
  password_require_numbers: boolean;
  password_require_symbols: boolean;
  session_timeout: number;
}

// Enhanced defaults for better security baseline
const DEFAULT_VALUES: SecurityFormData = {
  password_min_length: 8,
  password_require_uppercase: false,
  password_require_lowercase: true, // Enhanced: enabled by default
  password_require_numbers: true,  // Enhanced: enabled by default
  password_require_symbols: false,
  session_timeout: 3600 // 1 hour - keeping current sensible default
};

// Session timeout presets for better UX
const SESSION_TIMEOUT_PRESETS = [
  { label: '15 minutes', value: 900 },
  { label: '30 minutes', value: 1800 },
  { label: '1 hour', value: 3600 },
  { label: '2 hours', value: 7200 },
  { label: '4 hours', value: 14400 },
];

const SecurityTab: React.FC = () => {
  const [user, setUser] = React.useState<any>(null);
  const { data: settings, isLoading: isLoadingSettings } = useGlobalSettings('security');
  const updateSetting = useUpdateGlobalSetting();
  const createSetting = useCreateGlobalSetting();
  const [formData, setFormData] = useState<SecurityFormData>(DEFAULT_VALUES);
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
      }, {} as Record<string, any>);

      setFormData(prev => ({
        password_min_length: settingsMap.password_min_length !== undefined 
          ? Number(settingsMap.password_min_length) 
          : prev.password_min_length,
        password_require_uppercase: settingsMap.password_require_uppercase !== undefined 
          ? Boolean(settingsMap.password_require_uppercase) 
          : prev.password_require_uppercase,
        password_require_lowercase: settingsMap.password_require_lowercase !== undefined 
          ? Boolean(settingsMap.password_require_lowercase) 
          : prev.password_require_lowercase,
        password_require_numbers: settingsMap.password_require_numbers !== undefined 
          ? Boolean(settingsMap.password_require_numbers) 
          : prev.password_require_numbers,
        password_require_symbols: settingsMap.password_require_symbols !== undefined 
          ? Boolean(settingsMap.password_require_symbols) 
          : prev.password_require_symbols,
        session_timeout: settingsMap.session_timeout !== undefined 
          ? Number(settingsMap.session_timeout) 
          : prev.session_timeout
      }));
    }
  }, [settings]);

  const validateForm = (): boolean => {
    if (formData.password_min_length < 6 || formData.password_min_length > 32) {
      toast({
        title: 'Validation Error',
        description: 'Password minimum length must be between 6 and 32 characters.',
        variant: 'destructive',
      });
      return false;
    }

    if (formData.session_timeout < 300 || formData.session_timeout > 86400) {
      toast({
        title: 'Validation Error',
        description: 'Session timeout must be between 5 minutes (300 seconds) and 24 hours (86400 seconds).',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  // Enhanced: Get security level assessment
  const getSecurityLevel = (): { level: 'weak' | 'medium' | 'strong'; score: number } => {
    let score = 0;
    
    // Password length scoring
    if (formData.password_min_length >= 12) score += 3;
    else if (formData.password_min_length >= 8) score += 2;
    else score += 1;
    
    // Character requirements scoring
    if (formData.password_require_uppercase) score += 1;
    if (formData.password_require_lowercase) score += 1;
    if (formData.password_require_numbers) score += 1;
    if (formData.password_require_symbols) score += 2;
    
    // Session timeout scoring (shorter is more secure)
    if (formData.session_timeout <= 1800) score += 2; // 30 min or less
    else if (formData.session_timeout <= 3600) score += 1; // 1 hour or less
    
    const maxScore = 10;
    const percentage = (score / maxScore) * 100;
    
    if (percentage >= 80) return { level: 'strong', score: percentage };
    if (percentage >= 60) return { level: 'medium', score: percentage };
    return { level: 'weak', score: percentage };
  };

  // Enhanced: Get session timeout warning
  const getSessionTimeoutWarning = (): string | null => {
    const minutes = Math.round(formData.session_timeout / 60);
    
    if (formData.session_timeout < 900) { // Less than 15 minutes
      return `Very short session timeout (${minutes} minutes) may cause frequent user interruptions.`;
    }
    if (formData.session_timeout > 14400) { // More than 4 hours
      return `Long session timeout (${minutes} minutes) may pose security risks for unattended sessions.`;
    }
    return null;
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
          key: 'password_min_length',
          value: formData.password_min_length,
          type: 'number' as const,
          description: 'Minimum password length required'
        },
        {
          key: 'password_require_uppercase',
          value: formData.password_require_uppercase,
          type: 'boolean' as const,
          description: 'Require uppercase letters in passwords'
        },
        {
          key: 'password_require_lowercase',
          value: formData.password_require_lowercase,
          type: 'boolean' as const,
          description: 'Require lowercase letters in passwords'
        },
        {
          key: 'password_require_numbers',
          value: formData.password_require_numbers,
          type: 'boolean' as const,
          description: 'Require numbers in passwords'
        },
        {
          key: 'password_require_symbols',
          value: formData.password_require_symbols,
          type: 'boolean' as const,
          description: 'Require symbols in passwords'
        },
        {
          key: 'session_timeout',
          value: formData.session_timeout,
          type: 'number' as const,
          description: 'Session timeout in seconds'
        }
      ];

      for (const settingToSave of settingsToSave) {
        const existingSetting = settings?.find(s => s.setting_key === settingToSave.key);
        
        if (existingSetting) {
          await updateSetting.mutateAsync({
            id: existingSetting.id,
            setting_value: settingToSave.value,
            updated_by: user.id
          });
        } else {
          await createSetting.mutateAsync({
            setting_key: settingToSave.key,
            setting_value: settingToSave.value,
            setting_type: settingToSave.type,
            category: 'security',
            description: settingToSave.description,
            is_sensitive: false
          });
        }
      }

      invalidatePasswordRequirementsCache();

      toast({
        title: 'Success',
        description: 'Security settings saved successfully. Password requirements will be enforced for new signups.',
      });
    } catch (error) {
      console.error('Failed to save security settings:', error);
      toast({
        title: 'Save Failed',
        description: error instanceof Error ? error.message : 'Failed to save security settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (key: keyof SecurityFormData, value: number | boolean) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSessionTimeoutPreset = (preset: number) => {
    setFormData(prev => ({ ...prev, session_timeout: preset }));
  };

  const isLoading = isLoadingSettings;
  const isBusy = isSaving || updateSetting.isPending || createSetting.isPending;
  const securityAssessment = getSecurityLevel();
  const sessionWarning = getSessionTimeoutWarning();

  return (
    <div className="space-y-6">
      {/* Enhanced: Security Level Indicator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Level Assessment
          </CardTitle>
          <CardDescription>
            Current security configuration strength
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Security Level</span>
                <span className={`text-sm font-semibold ${
                  securityAssessment.level === 'strong' ? 'text-green-600' :
                  securityAssessment.level === 'medium' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {securityAssessment.level.toUpperCase()} ({Math.round(securityAssessment.score)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    securityAssessment.level === 'strong' ? 'bg-green-500' :
                    securityAssessment.level === 'medium' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${securityAssessment.score}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
          {isLoading ? (
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 bg-gray-200 rounded animate-pulse" />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="password_min_length">Minimum Password Length *</Label>
                <Input
                  id="password_min_length"
                  type="number"
                  value={formData.password_min_length}
                  onChange={(e) => handleInputChange('password_min_length', parseInt(e.target.value))}
                  min="6"
                  max="32"
                  disabled={isBusy}
                />
                <p className="text-sm text-muted-foreground">
                  Recommended: 8+ characters for basic security, 12+ for enhanced security
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Uppercase Letters</Label>
                    <p className="text-sm text-muted-foreground">Password must contain at least one uppercase letter (A-Z)</p>
                  </div>
                  <Switch
                    checked={formData.password_require_uppercase}
                    onCheckedChange={(checked) => handleInputChange('password_require_uppercase', checked)}
                    disabled={isBusy}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Lowercase Letters</Label>
                    <p className="text-sm text-muted-foreground">Password must contain at least one lowercase letter (a-z)</p>
                  </div>
                  <Switch
                    checked={formData.password_require_lowercase}
                    onCheckedChange={(checked) => handleInputChange('password_require_lowercase', checked)}
                    disabled={isBusy}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Numbers</Label>
                    <p className="text-sm text-muted-foreground">Password must contain at least one number (0-9)</p>
                  </div>
                  <Switch
                    checked={formData.password_require_numbers}
                    onCheckedChange={(checked) => handleInputChange('password_require_numbers', checked)}
                    disabled={isBusy}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Symbols</Label>
                    <p className="text-sm text-muted-foreground">Password must contain at least one symbol (!@#$%^&*)</p>
                  </div>
                  <Switch
                    checked={formData.password_require_symbols}
                    onCheckedChange={(checked) => handleInputChange('password_require_symbols', checked)}
                    disabled={isBusy}
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Session Management
          </CardTitle>
          <CardDescription>
            Configure user session and authentication settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="h-8 bg-gray-200 rounded animate-pulse" />
          ) : (
            <>
              {/* Enhanced: Session Timeout Presets */}
              <div className="space-y-3">
                <Label>Quick Session Timeout Presets</Label>
                <div className="flex flex-wrap gap-2">
                  {SESSION_TIMEOUT_PRESETS.map((preset) => (
                    <Button
                      key={preset.value}
                      variant={formData.session_timeout === preset.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSessionTimeoutPreset(preset.value)}
                      disabled={isBusy}
                      className="text-xs"
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="session_timeout">Session Timeout (seconds) *</Label>
                <Input
                  id="session_timeout"
                  type="number"
                  value={formData.session_timeout}
                  onChange={(e) => handleInputChange('session_timeout', parseInt(e.target.value))}
                  min="300"
                  max="86400"
                  disabled={isBusy}
                />
                <p className="text-sm text-muted-foreground">
                  Current: {Math.round(formData.session_timeout / 60)} minutes
                </p>
              </div>

              {/* Enhanced: Session Timeout Warning */}
              {sessionWarning && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {sessionWarning}
                  </AlertDescription>
                </Alert>
              )}
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

export default SecurityTab;
