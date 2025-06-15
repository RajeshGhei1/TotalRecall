
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock } from 'lucide-react';

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
  // TODO: Implement actual module access checking
  // This would check against user's subscription and tenant module assignments
  const hasAccess = true; // Placeholder - will be implemented with subscription system

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Alert className="m-4">
        <Lock className="h-4 w-4" />
        <AlertDescription>
          You don't have access to the {moduleName} module. Please contact your administrator or upgrade your subscription.
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
};

export default ModuleAccessGuard;
