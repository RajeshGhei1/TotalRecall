
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface PolicyComplianceStats {
  totalUsers: number;
  compliantUsers: number;
  nonCompliantUsers: number;
  pendingChecks: number;
}

interface EnforcementAction {
  id: string;
  user_id: string;
  action_type: 'notification_sent' | 'forced_reset' | 'grace_period_granted';
  enforcement_date: string;
  status: 'pending' | 'completed' | 'failed';
  user_email?: string;
}

export function usePasswordPolicyEnforcement() {
  const [stats, setStats] = useState<PolicyComplianceStats>({
    totalUsers: 0,
    compliantUsers: 0,
    nonCompliantUsers: 0,
    pendingChecks: 0
  });
  const [actions, setActions] = useState<EnforcementAction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadComplianceStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { count: compliantUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('password_meets_policy', true);

      const { count: pendingChecks } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('policy_check_required', true);

      setStats({
        totalUsers: totalUsers || 0,
        compliantUsers: compliantUsers || 0,
        nonCompliantUsers: (totalUsers || 0) - (compliantUsers || 0),
        pendingChecks: pendingChecks || 0
      });
    } catch (error) {
      console.error('Failed to load compliance stats:', error);
      toast({
        title: 'Error',
        description: 'Failed to load password compliance statistics.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadRecentActions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('password_policy_enforcement')
        .select(`
          id,
          user_id,
          action_type,
          enforcement_date,
          status,
          profiles!inner(email)
        `)
        .order('enforcement_date', { ascending: false })
        .limit(10);

      if (error) throw error;

      const formattedActions = data.map(action => ({
        id: action.id,
        user_id: action.user_id,
        action_type: action.action_type as 'notification_sent' | 'forced_reset' | 'grace_period_granted',
        enforcement_date: action.enforcement_date,
        status: action.status as 'pending' | 'completed' | 'failed',
        user_email: (action.profiles as unknown)?.email
      }));

      setActions(formattedActions);
    } catch (error) {
      console.error('Failed to load recent actions:', error);
    }
  }, []);

  const enforcePasswordPolicy = useCallback(async (
    actionType: 'notification_sent' | 'forced_reset' | 'grace_period_granted',
    customMessage?: string
  ) => {
    try {
      const { data: nonCompliantUsers, error } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('password_meets_policy', false)
        .eq('policy_check_required', true);

      if (error) throw error;
      if (!nonCompliantUsers || nonCompliantUsers.length === 0) {
        toast({
          title: 'No Action Needed',
          description: 'All users are already compliant with the password policy.',
        });
        return { success: true, affectedUsers: 0 };
      }

      const enforcementRecords = nonCompliantUsers.map(user => ({
        user_id: user.id,
        action_type: actionType,
        policy_version: { message: customMessage || 'Password policy enforcement action' },
        status: 'completed' as const
      }));

      await supabase
        .from('password_policy_enforcement')
        .insert(enforcementRecords);

      return { success: true, affectedUsers: nonCompliantUsers.length };
    } catch (error) {
      console.error('Failed to enforce password policy:', error);
      throw error;
    }
  }, []);

  return {
    stats,
    actions,
    isLoading,
    loadComplianceStats,
    loadRecentActions,
    enforcePasswordPolicy
  };
}
