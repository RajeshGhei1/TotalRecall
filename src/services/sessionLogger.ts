import { supabase } from '@/integrations/supabase/client';

export const sessionLogger = {
  // Log user login
  async logLogin(userId: string, tenantId?: string) {
    try {
      const { data: sessionId, error } = await supabase.rpc('log_user_login', {
        p_user_id: userId,
        p_tenant_id: tenantId || null,
        p_ip_address: '127.0.0.1', // Will be overridden by the function
        p_user_agent: navigator.userAgent,
        p_login_method: 'email'
      });

      if (error) {
        console.error('Failed to log user login:', error);
        return null;
      }

      return sessionId;
    } catch (error) {
      console.error('Error logging user login:', error);
      return null;
    }
  },

  // Log user logout
  async logLogout(sessionId: string) {
    try {
      const { error } = await supabase.rpc('log_user_logout', {
        p_session_id: sessionId
      });

      if (error) {
        console.error('Failed to log user logout:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error logging user logout:', error);
      return false;
    }
  },

  // Get active users count
  async getActiveUsersCount(tenantId?: string) {
    try {
      const { data, error } = await supabase.rpc('get_active_users_count', {
        p_tenant_id: tenantId || null
      });

      if (error) {
        console.error('Failed to get active users count:', error);
        return 0;
      }

      return data || 0;
    } catch (error) {
      console.error('Error getting active users count:', error);
      return 0;
    }
  },

  // Get user login history
  async getUserLoginHistory(userId: string, limit: number = 50) {
    try {
      const { data, error } = await supabase.rpc('get_user_login_history', {
        p_user_id: userId,
        p_limit: limit
      });

      if (error) {
        console.error('Failed to get user login history:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error getting user login history:', error);
      return [];
    }
  }
}; 