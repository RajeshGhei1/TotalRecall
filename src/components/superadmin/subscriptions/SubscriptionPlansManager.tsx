
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { useSubscriptionPlans } from '@/hooks/subscriptions/useSubscriptionPlans';
import SubscriptionPlansList from './SubscriptionPlansList';
import CreatePlanDialog from './CreatePlanDialog';
import ModulePermissionsManager from './ModulePermissionsManager';
import ModulePricingManager from './module-pricing/ModulePricingManager';

const SubscriptionPlansManager = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const { plans, isLoading } = useSubscriptionPlans();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Subscription Plans Management</CardTitle>
            <p className="text-sm text-muted-foreground">
              Create and manage subscription plans with module access control and dynamic pricing
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Plan
          </Button>
        </CardHeader>
        <CardContent>
          <SubscriptionPlansList 
            plans={plans}
            isLoading={isLoading}
            onSelectPlan={setSelectedPlanId}
            selectedPlanId={selectedPlanId}
          />
        </CardContent>
      </Card>

      {selectedPlanId && (
        <Tabs defaultValue="modules" className="space-y-6">
          <TabsList>
            <TabsTrigger value="modules">Module Permissions</TabsTrigger>
            <TabsTrigger value="pricing">Module Pricing</TabsTrigger>
          </TabsList>

          <TabsContent value="modules">
            <ModulePermissionsManager planId={selectedPlanId} />
          </TabsContent>

          <TabsContent value="pricing">
            <ModulePricingManager />
          </TabsContent>
        </Tabs>
      )}

      <CreatePlanDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </div>
  );
};

export default SubscriptionPlansManager;
