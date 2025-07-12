
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Mail,
  RefreshCw,
  Play,
  Pause
} from 'lucide-react';
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

export const BulkPasswordPolicyEnforcement: React.FC = () => {
  const [stats, setStats] = useState<PolicyComplianceStats>({
    totalUsers: 0,
    compliantUsers: 0,
    nonCompliantUsers: 0,
    pendingChecks: 0
  });
  const [actions, setActions] = useState<EnforcementAction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [enforcementProgress, setEnforcementProgress] = useState(0);
  const [isEnforcing, setIsEnforcing] = useState(false);
  const [customMessage, setCustomMessage] = useState(
    'Your password no longer meets our updated security requirements. Please update your password to continue using the system.'
  );

  useEffect(() => {
    loadComplianceStats();
    loadRecentActions();
  }, []);

  const loadComplianceStats = async () => {
    setIsLoading(true);
    try {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get compliant users
      const { count: compliantUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('password_meets_policy', true);

      // Get users requiring policy checks
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
  };

  const loadRecentActions = async () => {
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
  };

  const runComplianceCheck = async () => {
    setIsLoading(true);
    try {
      // Mark all users as requiring policy check
      const { error } = await supabase
        .from('profiles')
        .update({ 
          policy_check_required: true,
          last_policy_check: new Date().toISOString()
        })
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all real users

      if (error) throw error;

      // Reload stats
      await loadComplianceStats();

      toast({
        title: 'Compliance Check Initiated',
        description: 'All users have been marked for password policy compliance review.',
      });
    } catch (error) {
      console.error('Failed to run compliance check:', error);
      toast({
        title: 'Error',
        description: 'Failed to initiate compliance check.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendNotifications = async () => {
    setIsEnforcing(true);
    setEnforcementProgress(0);

    try {
      // Get non-compliant users
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
        setIsEnforcing(false);
        return;
      }

      // Send notifications in batches
      const batchSize = 10;
      for (let i = 0; i < nonCompliantUsers.length; i += batchSize) {
        const batch = nonCompliantUsers.slice(i, i + batchSize);
        
        // Create enforcement records
        const enforcementRecords = batch.map(user => ({
          user_id: user.id,
          action_type: 'notification_sent',
          policy_version: { message: customMessage },
          status: 'completed'
        }));

        await supabase
          .from('password_policy_enforcement')
          .insert(enforcementRecords);

        // Update progress
        const progress = Math.min(((i + batchSize) / nonCompliantUsers.length) * 100, 100);
        setEnforcementProgress(progress);

        // Small delay to prevent overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      await loadRecentActions();
      await loadComplianceStats();

      toast({
        title: 'Notifications Sent',
        description: `Password policy notifications sent to ${nonCompliantUsers.length} users.`,
      });
    } catch (error) {
      console.error('Failed to send notifications:', error);
      toast({
        title: 'Error',
        description: 'Failed to send password policy notifications.',
        variant: 'destructive',
      });
    } finally {
      setIsEnforcing(false);
      setEnforcementProgress(0);
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'notification_sent':
        return <Mail className="h-4 w-4" />;
      case 'forced_reset':
        return <RefreshCw className="h-4 w-4" />;
      case 'grace_period_granted':
        return <Clock className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const compliancePercentage = stats.totalUsers > 0 
    ? Math.round((stats.compliantUsers / stats.totalUsers) * 100) 
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Bulk Password Policy Enforcement
        </CardTitle>
        <CardDescription>
          Monitor and enforce password policy compliance across all users
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Compliance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Total Users</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">{stats.totalUsers}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-900">Compliant</span>
            </div>
            <p className="text-2xl font-bold text-green-900">{stats.compliantUsers}</p>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium text-red-900">Non-Compliant</span>
            </div>
            <p className="text-2xl font-bold text-red-900">{stats.nonCompliantUsers}</p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-900">Pending Checks</span>
            </div>
            <p className="text-2xl font-bold text-yellow-900">{stats.pendingChecks}</p>
          </div>
        </div>

        {/* Compliance Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Overall Compliance</Label>
            <span className="text-sm text-muted-foreground">{compliancePercentage}%</span>
          </div>
          <Progress value={compliancePercentage} className="h-2" />
        </div>

        <Separator />

        {/* Enforcement Actions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Enforcement Actions</h3>
            <Button
              onClick={runComplianceCheck}
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Run Compliance Check
            </Button>
          </div>

          {stats.nonCompliantUsers > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {stats.nonCompliantUsers} users are not compliant with the current password policy.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <Label htmlFor="custom-message">Notification Message</Label>
            <Textarea
              id="custom-message"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Enter the message to send to non-compliant users..."
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={sendNotifications}
              disabled={isEnforcing || stats.nonCompliantUsers === 0}
              className="flex items-center gap-2"
            >
              {isEnforcing ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              Send Notifications ({stats.nonCompliantUsers} users)
            </Button>
          </div>

          {isEnforcing && enforcementProgress > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Sending notifications...</span>
                <span className="text-sm">{Math.round(enforcementProgress)}%</span>
              </div>
              <Progress value={enforcementProgress} className="h-2" />
            </div>
          )}
        </div>

        <Separator />

        {/* Recent Actions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recent Enforcement Actions</h3>
          {actions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No enforcement actions yet.</p>
          ) : (
            <div className="space-y-2">
              {actions.map((action) => (
                <div key={action.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getActionIcon(action.action_type)}
                    <div>
                      <p className="text-sm font-medium">
                        {action.action_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {action.user_email} • {new Date(action.enforcement_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant={getStatusColor(action.status)}>
                    {action.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
