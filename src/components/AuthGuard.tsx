
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useSuperAdminCheck } from "@/hooks/useSuperAdminCheck";

interface AuthGuardProps {
  children: React.ReactNode;
  requiresSuperAdmin?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requiresSuperAdmin = false }) => {
  const { user, loading, bypassAuth } = useAuth();
  const location = useLocation();
  const { isSuperAdmin, isLoading: checkingRole, error } = useSuperAdminCheck();

  console.log('AuthGuard state:', { 
    user: !!user, 
    loading, 
    bypassAuth, 
    requiresSuperAdmin, 
    isSuperAdmin, 
    checkingRole,
    pathname: location.pathname 
  });

  // Show loading while checking authentication or role
  if (loading || (requiresSuperAdmin && checkingRole)) {
    console.log('AuthGuard: Showing loading state');
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // In bypass mode, allow access
  if (bypassAuth) {
    console.log('AuthGuard: Allowing access in bypass mode');
    return <>{children}</>;
  }

  // If no user, redirect to login
  if (!user) {
    console.log('AuthGuard: No user found, redirecting to auth');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If super admin required but user is not super admin, redirect to home
  if (requiresSuperAdmin && !isSuperAdmin) {
    console.log('AuthGuard: Super admin required but user is not super admin');
    toast({
      title: "Access Denied",
      description: "You need super admin privileges to access this area.",
      variant: "destructive",
    });
    return <Navigate to="/" replace />;
  }

  // Show error if there was an issue checking role
  if (error && requiresSuperAdmin) {
    toast({
      title: "Error",
      description: error,
      variant: "destructive",
    });
  }

  console.log('AuthGuard: Access granted, showing protected content');
  return <>{children}</>;
};

export default AuthGuard;
