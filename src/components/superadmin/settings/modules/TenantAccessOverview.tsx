
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { 
  Shield, 
  Users, 
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
  Crown
} from 'lucide-react';
import { ModuleAccessService } from '@/services/moduleAccessService';
import { SubscriptionService } from '@/services/subscriptionService';

interface TenantAccessOverviewProps {
  tenantId: string;
  tenantName: string;
}

const TenantAccessOverview: React.FC<TenantAccessOverviewProps> = ({
  tenantId,
  tenantName
}) => {
  const { data: accessStats, isLoading: statsLoading } = useQuery({
    queryKey: ['module-access-stats', tenantId],
    queryFn: () => ModuleAccessService.getAccessStats(tenantId)
  });

  const { data: subscriptionOverview, isLoading: subscriptionLoading } = useQuery({
    queryKey: ['tenant-subscription-overview', tenantId],
    queryFn: () => SubscriptionService.getTenantSubscriptionOverview(tenantId)
  });

  const { data: migrationCandidates } = useQuery({
    queryKey: ['migration-candidates', tenantId],
    queryFn: () => ModuleAccessService.getModulesNeedingMigration(tenantId)
  });

  if (statsLoading || subscriptionLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded"></div>
        ))}
      </div>
    );
  }

  const hasActiveSubscription = subscriptionOverview?.tenantSubscription?.status === 'active';

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Access Overview - {tenantName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-900">{accessStats?.subscriptionModules || 0}</div>
              <div className="text-sm text-green-700">Via Subscription</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="text-2xl font-bold text-amber-900">{accessStats?.overrideModules || 0}</div>
              <div className="text-sm text-amber-700">Via Override</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-900">{accessStats?.totalActiveModules || 0}</div>
              <div className="text-sm text-blue-700">Total Active</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-lg font-bold text-gray-900">{accessStats?.planName || 'No Plan'}</div>
              <div className="text-sm text-gray-700">Current Plan</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Subscription Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${hasActiveSubscription ? 'bg-green-100' : 'bg-gray-100'}`}>
                {hasActiveSubscription ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-gray-600" />
                )}
              </div>
              <div>
                <h3 className="font-medium">
                  {hasActiveSubscription ? 'Active Subscription' : 'No Active Subscription'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {hasActiveSubscription 
                    ? `Plan: ${accessStats?.planName}`
                    : 'Consider setting up a subscription plan for better module management'
                  }
                </p>
              </div>
            </div>
            <Badge variant={hasActiveSubscription ? "default" : "secondary"}>
              {hasActiveSubscription ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Migration Recommendations */}
      {migrationCandidates && migrationCandidates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Migration Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground mb-4">
                The following modules are currently assigned via override. Consider migrating them to subscription-based access:
              </p>
              {migrationCandidates.map((candidate) => (
                <div key={candidate.id} className="flex items-center justify-between p-3 border rounded-lg bg-amber-50">
                  <div>
                    <h4 className="font-medium">{candidate.moduleName}</h4>
                    <p className="text-sm text-muted-foreground">
                      Category: {candidate.moduleCategory} • Assigned: {new Date(candidate.assignedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline" className="border-amber-300 text-amber-800">
                    Override
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TenantAccessOverview;
