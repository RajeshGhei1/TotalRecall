
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Crown, ArrowRight } from 'lucide-react';
import { useModuleAccess } from '@/hooks/subscriptions/useModuleAccess';

interface ModuleAccessGuardProps {
  children: React.ReactNode;
  moduleName: string;
  tenantId: string | null;
  fallback?: React.ReactNode;
}

const ModuleAccessGuard: React.FC<ModuleAccessGuardProps> = ({
  children,
  moduleName,
  tenantId,
  fallback
}) => {
  const { data: accessResult, isLoading } = useModuleAccess(tenantId, moduleName);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!accessResult?.hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Card className="max-w-lg mx-auto mt-8">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-muted rounded-full w-fit">
            <Lock className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardTitle className="text-xl">Module Access Required</CardTitle>
          <p className="text-muted-foreground">
            This feature is not included in your current plan
          </p>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {accessResult?.plan && (
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Current Plan</p>
              <p className="font-semibold">{accessResult.plan.name}</p>
            </div>
          )}
          
          <div className="space-y-2">
            <p className="text-sm">
              Upgrade your plan to access <span className="font-medium">{moduleName.replace('_', ' ')}</span>
            </p>
            <Button className="w-full">
              <Crown className="h-4 w-4 mr-2" />
              Upgrade Plan
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
};

export default ModuleAccessGuard;
