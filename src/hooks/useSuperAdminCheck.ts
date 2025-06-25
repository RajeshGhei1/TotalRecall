
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface SuperAdminCheckResult {
  isSuperAdmin: boolean | null;
  isLoading: boolean;
  error: string | null;
}

export const useSuperAdminCheck = (): SuperAdminCheckResult => {
  const { user, bypassAuth } = useAuth();
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSuperAdminStatus = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // In bypass mode, automatically grant super admin access
        if (bypassAuth) {
          console.log('useSuperAdminCheck: Bypass mode enabled, granting super admin access');
          setIsSuperAdmin(true);
          setIsLoading(false);
          return;
        }

        // If no user, not super admin
        if (!user) {
          setIsSuperAdmin(false);
          setIsLoading(false);
          return;
        }

        console.log('useSuperAdminCheck: Checking super admin status for user:', user.id);
        
        // Check user role from profiles table
        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (profileError) {
          console.error('useSuperAdminCheck: Error checking admin status:', profileError);
          throw profileError;
        }
        
        const isAdmin = data.role === 'super_admin';
        console.log('useSuperAdminCheck: User role check result:', { role: data.role, isAdmin });
        setIsSuperAdmin(isAdmin);
      } catch (err: any) {
        console.error('useSuperAdminCheck: Error checking admin status:', err);
        setError('Failed to verify admin privileges');
        setIsSuperAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSuperAdminStatus();
  }, [user, bypassAuth]);

  return { isSuperAdmin, isLoading, error };
};
