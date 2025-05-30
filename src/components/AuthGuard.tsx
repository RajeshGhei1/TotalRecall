import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AuthGuardProps {
  children: React.ReactNode;
  requiresSuperAdmin?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requiresSuperAdmin = false }) => {
  const { user, loading, bypassAuth } = useAuth();
  const location = useLocation();

  // For super admin check
  const [isSuperAdmin, setIsSuperAdmin] = React.useState<boolean | null>(null);
  const [checkingRole, setCheckingRole] = React.useState(requiresSuperAdmin && !bypassAuth);

  useEffect(() => {
    const checkSuperAdmin = async () => {
      // In bypass mode, automatically grant super admin access
      if (bypassAuth) {
        console.log('AuthGuard: Bypass mode enabled, granting super admin access');
        setIsSuperAdmin(true);
        setCheckingRole(false);
        return;
      }

      if (!user || !requiresSuperAdmin) {
        setCheckingRole(false);
        return;
      }
      
      console.log('AuthGuard: Checking super admin status for user:', user.id);
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('AuthGuard: Error checking admin status:', error);
          throw error;
        }
        
        const isAdmin = data.role === 'super_admin';
        console.log('AuthGuard: User role check result:', { role: data.role, isAdmin });
        setIsSuperAdmin(isAdmin);
      } catch (error: any) {
        console.error('AuthGuard: Error checking admin status:', error);
        toast({
          title: "Error",
          description: "Failed to verify your admin privileges.",
          variant: "destructive",
        });
        setIsSuperAdmin(false);
      } finally {
        setCheckingRole(false);
      }
    };

    checkSuperAdmin();
  }, [user, requiresSuperAdmin, bypassAuth]);

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
  if (loading || checkingRole) {
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

  console.log('AuthGuard: Access granted, showing protected content');
  // Otherwise, show protected content
  return <>{children}</>;
};

export default AuthGuard;
