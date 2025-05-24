
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useLocation } from 'react-router-dom';

export type AdminType = 'super_admin' | 'tenant_admin' | null;

interface AdminContextResult {
  adminType: AdminType;
  isLoading: boolean;
  error: string | null;
}

export const useAdminContext = (): AdminContextResult => {
  const { user, bypassAuth } = useAuth();
  const location = useLocation();
  const [adminType, setAdminType] = useState<AdminType>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const determineAdminType = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // In bypass mode, determine from route
        if (bypassAuth) {
          const isSuperAdmin = location.pathname.startsWith('/superadmin');
          setAdminType(isSuperAdmin ? 'super_admin' : 'tenant_admin');
          setIsLoading(false);
          return;
        }

        // If no user, no admin access
        if (!user) {
          setAdminType(null);
          setIsLoading(false);
          return;
        }

        // Check user role from profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          setError('Failed to determine admin privileges');
          setAdminType(null);
        } else if (profile?.role === 'super_admin') {
          setAdminType('super_admin');
        } else {
          // Default to tenant admin for authenticated users
          setAdminType('tenant_admin');
        }
      } catch (err) {
        console.error('Error determining admin context:', err);
        setError('Failed to determine admin privileges');
        setAdminType(null);
      } finally {
        setIsLoading(false);
      }
    };

    determineAdminType();
  }, [user, bypassAuth, location.pathname]);

  return { adminType, isLoading, error };
};
