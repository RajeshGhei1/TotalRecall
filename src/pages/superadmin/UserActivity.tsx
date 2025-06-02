
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Users } from 'lucide-react';
import UserActivityDashboard from '@/components/superadmin/user-activity/UserActivityDashboard';
import UserSessionViewer from '@/components/superadmin/user-activity/UserSessionViewer';

const UserActivity: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">User Activity</h1>
        </div>
        <p className="text-muted-foreground">
          Monitor user sessions, track login patterns, and manage active connections
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Sessions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <UserActivityDashboard />
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <UserSessionViewer />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserActivity;
