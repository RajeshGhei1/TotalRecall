
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OverrideMigrationDashboard from '../../migration/OverrideMigrationDashboard';
import MigrationStatusTracker from '../../migration/MigrationStatusTracker';

const MigrationTabContent = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Migration Management</h2>
        <p className="text-gray-600">
          Manage the transition from manual overrides to subscription-based module access
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList>
          <TabsTrigger value="dashboard">Migration Dashboard</TabsTrigger>
          <TabsTrigger value="status">Status Tracker</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <OverrideMigrationDashboard />
        </TabsContent>

        <TabsContent value="status">
          <MigrationStatusTracker />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MigrationTabContent;
