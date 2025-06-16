
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Crown, ArrowRight } from 'lucide-react';
import { useUnifiedModuleAccess } from '@/hooks/subscriptions/useUnifiedModuleAccess';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const handleUpgradeClick = () => {
    navigate('/tenant-admin/upgrade');
  };

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
          <CardTitle className="text-xl">Subscription Required</CardTitle>
          <p className="text-muted-foreground">
            This feature requires an active subscription
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
            <Button className="w-full" onClick={handleUpgradeClick}>
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

export default UnifiedModuleAccessGuard;
