
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, Crown, ArrowRight, Loader2 } from 'lucide-react';
import { useUnifiedModuleAccess } from '@/hooks/subscriptions/useUnifiedModuleAccess';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ModuleAccessService } from '@/services/moduleAccessService';

interface ModuleAccessGuardProps {
  moduleName: string;
  requiredAccess?: 'view' | 'edit' | 'admin';
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

const ModuleAccessGuard: React.FC<ModuleAccessGuardProps> = ({
  moduleName,
  requiredAccess = 'view',
  fallback,
  children
}) => {
  const { user, bypassAuth } = useAuth();
  
  // Get current tenant ID
  const { data: tenantData } = useQuery({
    queryKey: ['currentTenantData', user?.id],
    queryFn: async () => {
      if (bypassAuth) {
        return { tenant_id: 'mock-tenant-id' };
      }
      
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_tenants')
        .select('tenant_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user || bypassAuth,
  });

  const currentTenantId = tenantData?.tenant_id || null;

  // Check unified module access (subscription-only)
  const { data: accessResult, isLoading } = useUnifiedModuleAccess(
    currentTenantId, 
    moduleName, 
    user?.id
  );

  // Log access attempt
  React.useEffect(() => {
    if (accessResult && user && currentTenantId) {
      const logAccess = async () => {
        try {
          const accessType = accessResult.hasAccess ? 'allowed' : 'denied';
          const accessSource = 'subscription';

          await ModuleAccessService.logModuleAccess(
            currentTenantId,
            user.id,
            moduleName,
            accessType,
            accessSource
          );
        } catch (error) {
          console.error('Failed to log module access:', error);
        }
      };

      logAccess();
    }
  }, [accessResult, user, currentTenantId, moduleName]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
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
            Access to "{moduleName.replace('_', ' ')}" is not available with your current plan
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
              Contact your administrator or upgrade your subscription to access this module
            </p>
            <Button className="w-full">
              <Crown className="h-4 w-4 mr-2" />
              Request Access
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
