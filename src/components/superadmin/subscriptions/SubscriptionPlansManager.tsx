
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { useSubscriptionPlans } from '@/hooks/subscriptions/useSubscriptionPlans';
import { useModulePermissionsSummary } from '@/hooks/subscriptions/useModulePermissionsSummary';
import SubscriptionPlansList from './SubscriptionPlansList';
import CreatePlanDialog from './CreatePlanDialog';
import ModulePermissionsManager from './ModulePermissionsManager';
import ModulePricingManager from './module-pricing/ModulePricingManager';
import PricingDisplay from './pricing/PricingDisplay';

const SubscriptionPlansManager = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const { plans, isLoading } = useSubscriptionPlans();
  
  // Get module permissions summary for the selected plan
  const { data: modulesSummary } = useModulePermissionsSummary(selectedPlanId || '');
  
  // Get enabled modules list for pricing calculation
  const enabledModules = React.useMemo(() => {
    return modulesSummary?.moduleDetails
      .filter(module => module.isEnabled)
      .map(module => module.name) || [];
  }, [modulesSummary]);

  const selectedPlan = plans?.find(plan => plan.id === selectedPlanId);

  console.log('Selected plan:', selectedPlan);
  console.log('Enabled modules for pricing:', enabledModules);

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

      {selectedPlanId && selectedPlan && (
        <div className="space-y-6">
          {/* Show current pricing for the selected plan */}
          <Card>
            <CardHeader>
              <CardTitle>Current Plan Pricing - {selectedPlan.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Live pricing calculation based on enabled modules ({enabledModules.length} modules enabled)
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Monthly Pricing</h4>
                  <PricingDisplay
                    key={`monthly-${selectedPlanId}-${enabledModules.join(',')}`}
                    planId={selectedPlanId}
                    enabledModules={enabledModules}
                    billingCycle="monthly"
                    showBreakdown={true}
                  />
                </div>
                <div>
                  <h4 className="font-medium mb-2">Annual Pricing</h4>
                  <PricingDisplay
                    key={`annual-${selectedPlanId}-${enabledModules.join(',')}`}
                    planId={selectedPlanId}
                    enabledModules={enabledModules}
                    billingCycle="annually"
                    showBreakdown={true}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

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
        </div>
      )}

      <CreatePlanDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </div>
  );
};

export default SubscriptionPlansManager;
