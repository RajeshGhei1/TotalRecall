import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useSessionLogger = () => {
  const { user, session } = useAuth();
  const sessionIdRef = useRef<string | null>(null);

  // Log user login
  const logLogin = async () => {
    if (!user) return;

    try {
      // Get user's tenant
      const { data: userTenant } = await supabase
        .from('user_tenants')
        .select('tenant_id')
        .eq('user_id', user.id)
        .single();

      // Get IP address (this will be the server's IP in Edge Functions)
      const ipAddress = '127.0.0.1'; // Will be overridden by the function
      const userAgent = navigator.userAgent;

      // Call the log_user_login function
      const { data: sessionId, error } = await supabase.rpc('log_user_login', {
        p_user_id: user.id,
        p_tenant_id: userTenant?.tenant_id || null,
        p_ip_address: ipAddress,
        p_user_agent: userAgent,
        p_login_method: 'email'
      });

      if (error) {
        console.error('Failed to log user login:', error);
      } else {
        sessionIdRef.current = sessionId;
        console.log('User login logged successfully');
      }
    } catch (error) {
      console.error('Error logging user login:', error);
    }
  };

  // Log user logout
  const logLogout = async () => {
    if (!sessionIdRef.current) return;

    try {
      const { error } = await supabase.rpc('log_user_logout', {
        p_session_id: sessionIdRef.current
      });

      if (error) {
        console.error('Failed to log user logout:', error);
      } else {
        console.log('User logout logged successfully');
        sessionIdRef.current = null;
      }
    } catch (error) {
      console.error('Error logging user logout:', error);
    }
  };

  // Log login when user session starts
  useEffect(() => {
    if (user && session && !sessionIdRef.current) {
      logLogin();
    }
  }, [user, session]);

  // Log logout when user session ends
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (sessionIdRef.current) {
        // Use sendBeacon for more reliable logout logging
        const data = JSON.stringify({
          session_id: sessionIdRef.current
        });
        
        // Try to send the logout data
        if (navigator.sendBeacon) {
          navigator.sendBeacon('/api/logout', data);
        }
        
        // Also try to log it directly
        logLogout();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Log logout when component unmounts
      if (sessionIdRef.current) {
        logLogout();
      }
    };
  }, []);

  return {
    sessionId: sessionIdRef.current,
    logLogin,
    logLogout
  };
}; 