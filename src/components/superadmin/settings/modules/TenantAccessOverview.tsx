
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  Settings, 
  TrendingUp, 
  Clock,
  Users
} from 'lucide-react';
import { ModuleAccessService } from '@/services/moduleAccessService';
import { useQuery } from '@tanstack/react-query';

interface TenantAccessOverviewProps {
  tenantId: string;
  tenantName: string;
}

const TenantAccessOverview: React.FC<TenantAccessOverviewProps> = ({
  tenantId,
  tenantName
}) => {
  const { data: accessStats, isLoading } = useQuery({
    queryKey: ['tenant-access-stats', tenantId],
    queryFn: () => ModuleAccessService.getAccessStats(tenantId)
  });

  const { data: migrationCandidates } = useQuery({
    queryKey: ['modules-needing-migration', tenantId],
    queryFn: () => ModuleAccessService.getModulesNeedingMigration(tenantId)
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasOverrides = (accessStats?.overrideModules || 0) > 0;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Access Overview - {tenantName}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-center mb-2">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-900">{accessStats?.subscriptionModules || 0}</p>
              <p className="text-sm text-green-700">Via Subscription</p>
            </div>
            
            <div className="text-center p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center justify-center mb-2">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
              <p className="text-2xl font-bold text-amber-900">{accessStats?.overrideModules || 0}</p>
              <p className="text-sm text-amber-700">Via Override</p>
            </div>
            
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-900">{accessStats?.totalActiveModules || 0}</p>
              <p className="text-sm text-blue-700">Total Active</p>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-center mb-2">
                <Settings className="h-6 w-6 text-gray-600" />
              </div>
              <p className="text-lg font-bold text-gray-900">{accessStats?.planName}</p>
              <p className="text-sm text-gray-700">Current Plan</p>
            </div>
          </div>

          {/* Override Warning */}
          {hasOverrides && (
            <Alert className="border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <div className="flex items-center justify-between">
                  <div>
                    <strong>Override Assignments Detected</strong>
                    <p className="text-sm mt-1">
                      This tenant has {accessStats?.overrideModules} modules assigned via override. 
                      Consider migrating to subscription-based access.
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="border-amber-300 text-amber-800">
                    Review Overrides
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Migration Candidates */}
          {migrationCandidates && migrationCandidates.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-700">Override Assignments:</h4>
              <div className="space-y-2">
                {migrationCandidates.map((module: any) => (
                  <div key={module.id} className="flex items-center justify-between p-2 bg-amber-50 rounded border border-amber-200">
                    <div>
                      <span className="font-medium text-amber-900">{module.moduleName}</span>
                      <Badge variant="outline" className="ml-2 text-xs bg-amber-100 border-amber-300">
                        {module.moduleCategory}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-amber-700">
                      <Clock className="h-3 w-3" />
                      {module.expiresAt ? (
                        <span>Expires: {new Date(module.expiresAt).toLocaleDateString()}</span>
                      ) : (
                        <span>No expiry</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantAccessOverview;
