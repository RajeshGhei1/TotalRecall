
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Crown, ArrowRight, Shield, AlertTriangle } from 'lucide-react';
import { useUnifiedModuleAccess } from '@/hooks/subscriptions/useUnifiedModuleAccess';

interface UnifiedModuleAccessGuardProps {
  children: React.ReactNode;
  moduleName: string;
  tenantId: string | null;
  userId?: string;
  fallback?: React.ReactNode;
}

const UnifiedModuleAccessGuard: React.FC<UnifiedModuleAccessGuardProps> = ({
  children,
  moduleName,
  tenantId,
  userId,
  fallback
}) => {
  const { data: accessResult, isLoading } = useUnifiedModuleAccess(tenantId, moduleName, userId);

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
          {accessResult?.subscriptionDetails && (
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Current Plan</p>
              <p className="font-semibold">{accessResult.subscriptionDetails.planName}</p>
              <Badge variant="outline" className="mt-1">
                {accessResult.subscriptionDetails.subscriptionType}
              </Badge>
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

  return (
    <div>
      {/* Show access source indicator for transparency */}
      {accessResult.accessSource === 'tenant_override' && (
        <Alert className="mb-4 border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <div className="flex items-center justify-between">
              <span>
                Access granted via override assignment
                {accessResult.overrideDetails && (
                  <span className="text-sm ml-2">
                    (by {accessResult.overrideDetails.assignedBy})
                  </span>
                )}
              </span>
              <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                Override
              </Badge>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {accessResult.accessSource === 'subscription' && accessResult.subscriptionDetails && (
        <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="text-green-800">
                Access via {accessResult.subscriptionDetails.planName} plan
              </span>
            </div>
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
              Subscription
            </Badge>
          </div>
        </div>
      )}

      {children}
    </div>
  );
};

export default UnifiedModuleAccessGuard;
