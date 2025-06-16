
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Users,
  Mail,
  RefreshCw
} from 'lucide-react';

interface MigrationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  progress: number;
  completedAt?: string;
  errorMessage?: string;
}

interface TenantMigrationStatus {
  tenant_id: string;
  tenant_name: string;
  status: 'pending' | 'notified' | 'subscribed' | 'completed';
  notification_sent: boolean;
  subscription_created: boolean;
  last_updated: string;
}

const MigrationStatusTracker = () => {
  const [migrationSteps, setMigrationSteps] = useState<MigrationStep[]>([
    {
      id: 'audit',
      title: 'Data Audit Complete',
      description: 'Export and analyze existing override assignments',
      status: 'completed',
      progress: 100,
      completedAt: new Date().toISOString()
    },
    {
      id: 'subscriptions',
      title: 'Temporary Subscriptions',
      description: 'Create temporary subscription plans for affected tenants',
      status: 'in-progress',
      progress: 75
    },
    {
      id: 'notifications',
      title: 'Tenant Notifications',
      description: 'Send communication to affected tenant administrators',
      status: 'pending',
      progress: 0
    },
    {
      id: 'verification',
      title: 'Access Verification',
      description: 'Verify all tenants have proper subscription access',
      status: 'pending',
      progress: 0
    },
    {
      id: 'cleanup',
      title: 'Override Cleanup',
      description: 'Remove manual override system and legacy code',
      status: 'pending',
      progress: 0
    }
  ]);

  const [tenantStatuses, setTenantStatuses] = useState<TenantMigrationStatus[]>([
    {
      tenant_id: 'tenant-1',
      tenant_name: 'Sample Company A',
      status: 'subscribed',
      notification_sent: true,
      subscription_created: true,
      last_updated: new Date().toISOString()
    },
    {
      tenant_id: 'tenant-2',
      tenant_name: 'Sample Company B',
      status: 'notified',
      notification_sent: true,
      subscription_created: false,
      last_updated: new Date().toISOString()
    }
  ]);

  const overallProgress = migrationSteps.reduce((total, step) => total + step.progress, 0) / migrationSteps.length;

  const getStepIcon = (status: MigrationStep['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in-progress': return <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />;
      case 'failed': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default: return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStepColor = (status: MigrationStep['status']) => {
    switch (status) {
      case 'completed': return 'border-green-200 bg-green-50';
      case 'in-progress': return 'border-blue-200 bg-blue-50';
      case 'failed': return 'border-red-200 bg-red-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getTenantStatusColor = (status: TenantMigrationStatus['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'subscribed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'notified': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-xl text-blue-900">Migration Progress</CardTitle>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">Overall Completion</span>
              <span className="text-sm font-medium text-blue-900">{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="w-full" />
          </div>
        </CardHeader>
      </Card>

      {/* Migration Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Migration Steps</CardTitle>
          <p className="text-sm text-muted-foreground">
            Track the progress of each migration phase
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {migrationSteps.map((step, index) => (
              <div
                key={step.id}
                className={`border rounded-lg p-4 ${getStepColor(step.status)}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStepIcon(step.status)}
                    <div>
                      <h4 className="font-medium">{step.title}</h4>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="mb-1">
                      Step {index + 1}
                    </Badge>
                    {step.completedAt && (
                      <p className="text-xs text-gray-500">
                        {new Date(step.completedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                {step.status !== 'pending' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Progress</span>
                      <span className="text-sm font-medium">{step.progress}%</span>
                    </div>
                    <Progress value={step.progress} className="w-full h-2" />
                  </div>
                )}

                {step.errorMessage && (
                  <div className="mt-3 p-2 bg-red-100 border border-red-200 rounded text-sm text-red-700">
                    {step.errorMessage}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tenant Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tenant Migration Status</CardTitle>
              <p className="text-sm text-muted-foreground">
                Individual tenant progress through migration
              </p>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tenantStatuses.map((tenant) => (
              <div
                key={tenant.tenant_id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-gray-600" />
                  <div>
                    <h4 className="font-medium">{tenant.tenant_name}</h4>
                    <p className="text-sm text-gray-600">{tenant.tenant_id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right text-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="h-3 w-3" />
                      <span className={tenant.notification_sent ? 'text-green-600' : 'text-gray-400'}>
                        {tenant.notification_sent ? 'Notified' : 'Pending'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3" />
                      <span className={tenant.subscription_created ? 'text-green-600' : 'text-gray-400'}>
                        {tenant.subscription_created ? 'Subscribed' : 'Pending'}
                      </span>
                    </div>
                  </div>

                  <Badge className={getTenantStatusColor(tenant.status)}>
                    {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MigrationStatusTracker;
