
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissionCheck } from '@/hooks/security/useSecurityContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle } from 'lucide-react';

interface RouteGuardProps {
  children: React.ReactNode;
  requiredPermission?: {
    resource: string;
    action: string;
  };
  requiredRole?: string[];
  fallbackPath?: string;
  showAccessDenied?: boolean;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({
  children,
  requiredPermission,
  requiredRole,
  fallbackPath = '/login',
  showAccessDenied = true,
}) => {
  const { user, isLoading } = useAuth();
  const { hasPermission } = usePermissionCheck();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRole && requiredRole.length > 0) {
    // TODO: Implement role checking when user roles are available
    // For now, assume super_admin role exists
    const userRole = 'super_admin'; // This should come from user context
    if (!requiredRole.includes(userRole)) {
      if (showAccessDenied) {
        return (
          <div className="container mx-auto px-4 py-8">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Access denied. You do not have the required role to access this resource.
                Required roles: {requiredRole.join(', ')}
              </AlertDescription>
            </Alert>
          </div>
        );
      }
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Check permission-based access
  if (requiredPermission) {
    const { resource, action } = requiredPermission;
    if (!hasPermission(resource, action)) {
      if (showAccessDenied) {
        return (
          <div className="container mx-auto px-4 py-8">
            <Alert variant="destructive">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Access denied. You do not have permission to {action} {resource}.
              </AlertDescription>
            </Alert>
          </div>
        );
      }
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};
