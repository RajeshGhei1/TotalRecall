
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
        setIsSuperAdmin(true);
        setCheckingRole(false);
        return;
      }

      if (!user || !requiresSuperAdmin) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        setIsSuperAdmin(data.role === 'super_admin');
      } catch (error: any) {
        console.error('Error checking admin status:', error);
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

  // Show nothing while checking authentication or role
  if (loading || checkingRole) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // In bypass mode, allow access
  if (bypassAuth) {
    return <>{children}</>;
  }

  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If super admin required but user is not super admin, redirect to home
  if (requiresSuperAdmin && !isSuperAdmin) {
    toast({
      title: "Access Denied",
      description: "You need super admin privileges to access this area.",
      variant: "destructive",
    });
    return <Navigate to="/" replace />;
  }

  // Otherwise, show protected content
  return <>{children}</>;
};

export default AuthGuard;
