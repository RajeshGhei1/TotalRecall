
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSystemHealthSummary } from '@/hooks/global-settings/useSystemHealth';
import { useGlobalSettings } from '@/hooks/global-settings/useGlobalSettings';
import { Database, Server, Activity, Clock, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

const SystemTab: React.FC = () => {
  const { data: healthMetrics, isLoading: healthLoading } = useSystemHealthSummary();
  const { data: settings } = useGlobalSettings();

  const getHealthStatus = (metric: any) => {
    if (!metric.threshold_warning && !metric.threshold_critical) {
      return 'unknown';
    }

    if (metric.threshold_critical && metric.metric_value >= metric.threshold_critical) {
      return 'critical';
    }

    if (metric.threshold_warning && metric.metric_value >= metric.threshold_warning) {
      return 'warning';
    }

    return 'healthy';
  };

  const getStatusBadge = (status: string) => {
    const config = {
      healthy: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-500' },
      warning: { variant: 'secondary' as const, icon: AlertTriangle, color: 'text-yellow-500' },
      critical: { variant: 'destructive' as const, icon: AlertTriangle, color: 'text-red-500' },
      unknown: { variant: 'outline' as const, icon: Activity, color: 'text-gray-500' }
    };

    const { variant, icon: Icon, color } = config[status] || config.unknown;

    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className={`h-3 w-3 ${color}`} />
        {status}
      </Badge>
    );
  };

  const systemInfo = {
    version: '2.1.0',
    environment: 'Production',
    database: 'PostgreSQL 15.4',
    uptime: '15 days, 4 hours',
    lastBackup: '2024-01-15 02:00:00 UTC'
  };

  if (healthLoading) {
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
            <Server className="h-5 w-5" />
            System Information
          </CardTitle>
          <CardDescription>
            Core system information and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Version</Label>
              <p className="text-lg font-mono">{systemInfo.version}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Environment</Label>
              <Badge variant="default">{systemInfo.environment}</Badge>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Database</Label>
              <p className="text-sm">{systemInfo.database}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">System Uptime</Label>
              <p className="text-sm">{systemInfo.uptime}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Last Backup</Label>
              <p className="text-sm">{systemInfo.lastBackup}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Health Metrics
          </CardTitle>
          <CardDescription>
            Real-time system performance and health indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          {healthMetrics && healthMetrics.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {healthMetrics.map((metric) => {
                const status = getHealthStatus(metric);
                return (
                  <Card key={metric.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium capitalize">
                        {metric.metric_name.replace(/_/g, ' ')}
                      </h4>
                      {getStatusBadge(status)}
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold">
                        {metric.metric_value.toFixed(2)}
                        {metric.metric_unit && (
                          <span className="text-sm font-normal ml-1">{metric.metric_unit}</span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(metric.recorded_at), 'MMM dd, HH:mm')}
                      </p>
                      {(metric.threshold_warning || metric.threshold_critical) && (
                        <div className="text-xs text-muted-foreground">
                          {metric.threshold_warning && (
                            <p>Warning: {metric.threshold_warning}{metric.metric_unit}</p>
                          )}
                          {metric.threshold_critical && (
                            <p>Critical: {metric.threshold_critical}{metric.metric_unit}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No health metrics available</p>
              <p className="text-sm">Health monitoring data will appear here once the system starts collecting metrics.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Configuration Summary
          </CardTitle>
          <CardDescription>
            Overview of current system configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          {settings && settings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {settings.slice(0, 8).map((setting) => (
                <div key={setting.id} className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <p className="font-medium capitalize">
                      {setting.setting_key.replace(/_/g, ' ')}
                    </p>
                    {setting.description && (
                      <p className="text-xs text-muted-foreground">{setting.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    {setting.setting_type === 'boolean' ? (
                      <Badge variant={setting.setting_value ? 'default' : 'secondary'}>
                        {setting.setting_value ? 'Enabled' : 'Disabled'}
                      </Badge>
                    ) : (
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {String(setting.setting_value)}
                      </code>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No configuration data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Add Label component since it's being used
const Label: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
    {children}
  </label>
);

export default SystemTab;
