
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SubscriptionPlansManager from '@/components/superadmin/subscriptions/SubscriptionPlansManager';
import TenantSubscriptionManager from '@/components/superadmin/subscriptions/TenantSubscriptionManager';

const SubscriptionPlans = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Subscription Management</h1>
          <p className="text-muted-foreground">
            Manage subscription plans, module access, and tenant assignments
          </p>
        </div>

        <Tabs defaultValue="plans" className="space-y-6">
          <TabsList>
            <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
            <TabsTrigger value="assignments">Tenant Assignments</TabsTrigger>
          </TabsList>

          <TabsContent value="plans">
            <SubscriptionPlansManager />
          </TabsContent>

          <TabsContent value="assignments">
            <TenantSubscriptionManager />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default SubscriptionPlans;
