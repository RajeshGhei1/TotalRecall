
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Activity } from 'lucide-react';
import AuditDashboard from '@/components/superadmin/audit/AuditDashboard';
import AuditLogViewer from '@/components/superadmin/audit/AuditLogViewer';

const AuditLogs: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Audit Logs</h1>
        </div>
        <p className="text-muted-foreground">
          Monitor system activities, track user actions, and maintain security compliance
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Audit Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <AuditDashboard />
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <AuditLogViewer />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuditLogs;
