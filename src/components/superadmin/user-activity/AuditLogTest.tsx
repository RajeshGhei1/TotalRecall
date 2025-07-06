import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuditLogger } from '@/hooks/audit/useAuditLogger';
import { sessionLogger } from '@/services/sessionLogger';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const AuditLogTest: React.FC = () => {
  const { user } = useAuth();
  const { logEvent } = useAuditLogger();
  const [testResults, setTestResults] = useState<{
    auditLog: boolean;
    userSession: boolean;
    activeUsers: boolean;
  }>({
    auditLog: false,
    userSession: false,
    activeUsers: false
  });

  const testAuditLogging = async () => {
    try {
      await logEvent('TEST', 'test_entity', {
        entity_id: 'test-123',
        severity: 'low',
        module_name: 'test',
        additional_context: { test: true, timestamp: new Date().toISOString() }
      });
      
      setTestResults(prev => ({ ...prev, auditLog: true }));
      toast({
        title: 'Audit Log Test',
        description: 'Audit log test successful!',
      });
    } catch (error) {
      console.error('Audit log test failed:', error);
      toast({
        title: 'Audit Log Test Failed',
        description: 'Failed to log audit event',
        variant: 'destructive',
      });
    }
  };

  const testUserSession = async () => {
    if (!user) {
      toast({
        title: 'User Session Test Failed',
        description: 'No user logged in',
        variant: 'destructive',
      });
      return;
    }

    try {
      const sessionId = await sessionLogger.logLogin(user.id);
      if (sessionId) {
        setTestResults(prev => ({ ...prev, userSession: true }));
        toast({
          title: 'User Session Test',
          description: 'User session test successful!',
        });
      } else {
        throw new Error('Failed to create session (no sessionId returned)');
      }
    } catch (error: any) {
      console.error('User session test failed:', error);
      toast({
        title: 'User Session Test Failed',
        description: `Failed to log user session: ${error?.message || error}`,
        variant: 'destructive',
      });
    }
  };

  const testActiveUsers = async () => {
    try {
      const count = await sessionLogger.getActiveUsersCount();
      setTestResults(prev => ({ ...prev, activeUsers: true }));
      toast({
        title: 'Active Users Test',
        description: `Active users count: ${count}`,
      });
    } catch (error) {
      console.error('Active users test failed:', error);
      toast({
        title: 'Active Users Test Failed',
        description: 'Failed to get active users count',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Log & User Tracking Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Audit Logging</h4>
              <p className="text-sm text-muted-foreground">
                Test the audit log system
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={testResults.auditLog ? "default" : "secondary"}>
                {testResults.auditLog ? "✓ Working" : "Not Tested"}
              </Badge>
              <Button onClick={testAuditLogging} size="sm">
                Test
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">User Session Tracking</h4>
              <p className="text-sm text-muted-foreground">
                Test user session logging
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={testResults.userSession ? "default" : "secondary"}>
                {testResults.userSession ? "✓ Working" : "Not Tested"}
              </Badge>
              <Button onClick={testUserSession} size="sm">
                Test
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Active Users Count</h4>
              <p className="text-sm text-muted-foreground">
                Test active users counting
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={testResults.activeUsers ? "default" : "secondary"}>
                {testResults.activeUsers ? "✓ Working" : "Not Tested"}
              </Badge>
              <Button onClick={testActiveUsers} size="sm">
                Test
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-muted rounded-lg">
          <h5 className="font-medium mb-2">Status Summary:</h5>
          <div className="space-y-1 text-sm">
            <div>• Audit Logs: {testResults.auditLog ? "✅ Working" : "❌ Not tested"}</div>
            <div>• User Sessions: {testResults.userSession ? "✅ Working" : "❌ Not tested"}</div>
            <div>• Active Users: {testResults.activeUsers ? "✅ Working" : "❌ Not tested"}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditLogTest; 