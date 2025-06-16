
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Crown, 
  Settings, 
  AlertTriangle, 
  CheckCircle,
  ArrowRight,
  Shield
} from 'lucide-react';
import { useSystemModules } from '@/hooks/useSystemModules';
import { useTenantModules } from '@/hooks/modules/useTenantModules';
import { useQuery } from '@tanstack/react-query';
import { ModuleAccessService } from '@/services/moduleAccessService';
import { SubscriptionService } from '@/services/subscriptionService';

interface ModuleEnablementManagerProps {
  tenantId: string;
  tenantName: string;
  onConfigureModule?: (moduleName: string) => void;
}

const ModuleEnablementManager: React.FC<ModuleEnablementManagerProps> = ({
  tenantId,
  tenantName,
  onConfigureModule
}) => {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const { data: systemModules } = useSystemModules();
  const { data: tenantAssignments } = useTenantModules(tenantId);

  const { data: accessStats, isLoading: statsLoading } = useQuery({
    queryKey: ['module-access-stats', tenantId],
    queryFn: () => ModuleAccessService.getAccessStats(tenantId)
  });

  const { data: subscriptionOverview } = useQuery({
    queryKey: ['tenant-subscription-overview', tenantId],
    queryFn: () => SubscriptionService.getTenantSubscriptionOverview(tenantId)
  });

  // Filter integration modules
  const integrationModules = systemModules?.filter(module => 
    ['marketing', 'communication', 'finance', 'integrations'].includes(module.category)
  ) || [];

  const getModuleStatus = (moduleName: string) => {
    // Check if enabled via subscription
    if (subscriptionOverview?.tenantSubscription) {
      // This would need to be enhanced to check actual permissions
      return { enabled: true, source: 'subscription' as const };
    }

    // Check if enabled via override
    const hasOverride = tenantAssignments?.some(assignment => 
      assignment.module?.name === moduleName && assignment.is_enabled
    );

    if (hasOverride) {
      return { enabled: true, source: 'override' as const };
    }

    return { enabled: false, source: 'none' as const };
  };

  const getStatusBadge = (status: ReturnType<typeof getModuleStatus>) => {
    if (!status.enabled) {
      return <Badge variant="secondary">Not Available</Badge>;
    }

    if (status.source === 'subscription') {
      return <Badge className="bg-green-100 text-green-800 border-green-300">Via Subscription</Badge>;
    }

    return <Badge className="bg-amber-100 text-amber-800 border-amber-300">Via Override</Badge>;
  };

  const handleConfigureModule = (moduleName: string) => {
    if (onConfigureModule) {
      onConfigureModule(moduleName);
    }
  };

  const getActionButton = (moduleName: string, status: ReturnType<typeof getModuleStatus>) => {
    if (status.enabled) {
      return (
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => handleConfigureModule(moduleName)}
        >
          <Settings className="h-4 w-4 mr-1" />
          Configure
        </Button>
      );
    }

    // Not enabled - show upgrade path
    return (
      <Button size="sm" variant="outline" disabled>
        <Crown className="h-4 w-4 mr-1" />
        Upgrade Required
      </Button>
    );
  };

  if (statsLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Module Access Overview - {tenantName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-900">{accessStats?.subscriptionModules || 0}</div>
              <div className="text-sm text-green-700">Via Subscription</div>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="text-2xl font-bold text-amber-900">{accessStats?.overrideModules || 0}</div>
              <div className="text-sm text-amber-700">Via Override</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-900">{accessStats?.totalActiveModules || 0}</div>
              <div className="text-sm text-blue-700">Total Active</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-lg font-bold text-gray-900">{accessStats?.planName || 'No Plan'}</div>
              <div className="text-sm text-gray-700">Current Plan</div>
            </div>
          </div>

          {accessStats && accessStats.overrideModules > 0 && (
            <Alert className="border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <div className="flex items-center justify-between">
                  <div>
                    <strong>Override Assignments Detected</strong>
                    <p className="text-sm mt-1">
                      This tenant has {accessStats.overrideModules} modules assigned via override. 
                      Consider migrating to subscription-based access for better management.
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="border-amber-300 text-amber-800">
                    Migrate to Plan
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Module Management */}
      <Tabs defaultValue="available" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="available">Available Modules</TabsTrigger>
          <TabsTrigger value="upgrade">Upgrade Options</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {integrationModules.map((module) => {
              const status = getModuleStatus(module.name);
              
              return (
                <Card 
                  key={module.id}
                  className={`transition-colors hover:shadow-md ${
                    status.enabled ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-lg bg-blue-100 text-blue-800">
                        <Settings className="h-5 w-5" />
                      </div>
                      {getStatusBadge(status)}
                    </div>
                    <CardTitle className="text-lg">
                      {module.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </CardTitle>
                    <p className="text-sm text-gray-600">{module.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {module.category}
                      </Badge>
                      {getActionButton(module.name, status)}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="upgrade" className="space-y-4 mt-6">
          <Card>
            <CardContent className="p-8 text-center">
              <Crown className="h-12 w-12 mx-auto mb-4 text-amber-500" />
              <h3 className="text-lg font-medium mb-2">Upgrade Subscription Plan</h3>
              <p className="text-gray-600 mb-4">
                Get access to more integration modules by upgrading to a higher tier plan
              </p>
              <Button className="w-full max-w-md">
                <Crown className="h-4 w-4 mr-2" />
                View Available Plans
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModuleEnablementManager;
