import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Shield, Activity, ArrowLeft, TestTube } from 'lucide-react';
import AuditDashboard from '@/components/superadmin/audit/AuditDashboard';
import AuditLogViewer from '@/components/superadmin/audit/AuditLogViewer';
import AuditLogTest from '@/components/superadmin/user-activity/AuditLogTest';

const AuditLogs: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTenantId, setSelectedTenantId] = useState<string | undefined>();

  const handleBackToDashboard = () => {
    navigate('/superadmin/dashboard');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Audit Logs</h1>
          </div>
          <Button 
            variant="outline" 
            onClick={handleBackToDashboard}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to BI Dashboard
          </Button>
        </div>
        <p className="text-muted-foreground">
          Monitor system activities, track user actions, and maintain security compliance
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Audit Logs
          </TabsTrigger>
          <TabsTrigger value="test" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Test
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <AuditDashboard selectedTenantId={selectedTenantId} />
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <AuditLogViewer 
            selectedTenantId={selectedTenantId} 
            onTenantChange={setSelectedTenantId}
          />
        </TabsContent>

        <TabsContent value="test" className="space-y-6">
          <AuditLogTest />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuditLogs;
