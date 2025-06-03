
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGlobalSettings, useUpdateGlobalSetting } from '@/hooks/global-settings/useGlobalSettings';
import { useSystemHealthSummary } from '@/hooks/global-settings/useSystemHealth';
import { Loader2, Save, Gauge, Zap, Database, Activity } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';

const PerformanceTab: React.FC = () => {
  const { user } = useAuthContext();
  const { data: settings, isLoading } = useGlobalSettings('performance');
  const { data: healthMetrics } = useSystemHealthSummary();
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
      console.error('Failed to save performance settings:', error);
    }
  };

  const handleInputChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const getHealthStatus = (value: number, warning?: number, critical?: number) => {
    if (critical && value >= critical) return 'critical';
    if (warning && value >= warning) return 'warning';
    return 'healthy';
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
            <Activity className="h-5 w-5" />
            System Health Overview
          </CardTitle>
          <CardDescription>
            Real-time system performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          {healthMetrics && healthMetrics.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {healthMetrics.map((metric) => {
                const status = getHealthStatus(
                  metric.metric_value, 
                  metric.threshold_warning, 
                  metric.threshold_critical
                );
                
                return (
                  <div key={metric.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{metric.metric_name}</span>
                      <Badge 
                        variant={status === 'critical' ? 'destructive' : 
                                status === 'warning' ? 'secondary' : 'default'}
                      >
                        {status}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold">
                      {metric.metric_value.toFixed(2)} {metric.metric_unit}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No health metrics available
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            API Rate Limiting
          </CardTitle>
          <CardDescription>
            Configure API request limits to prevent abuse
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Caching Configuration
          </CardTitle>
          <CardDescription>
            Configure cache settings for optimal performance
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
              min="60"
              max="3600"
            />
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
          Save Performance Settings
        </Button>
      </div>
    </div>
  );
};

export default PerformanceTab;
