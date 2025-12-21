
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, CreditCard, Settings2 } from 'lucide-react';
import { useSubscriptionPlans } from '@/hooks/subscriptions/useSubscriptionPlans';
import { useModulePermissionsSummary } from '@/hooks/subscriptions/useModulePermissionsSummary';
import SubscriptionPlansList from './SubscriptionPlansList';
import CreatePlanDialog from './CreatePlanDialog';
import ModulePermissionsManager from './ModulePermissionsManager';
import ModulePricingManager from './module-pricing/ModulePricingManager';
import PricingDisplay from './pricing/PricingDisplay';
import SubscriptionPlansDebug from '@/components/debug/SubscriptionPlansDebug';

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
    <div className="space-y-8">
      {/* Debug Component - Remove this after fixing */}
      <SubscriptionPlansDebug />
      
      {/* Header Card */}
      <Card className="border-2 border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="flex flex-row items-center justify-between pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500 rounded-xl">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">Subscription Plans Management</CardTitle>
              <p className="text-gray-600 mt-1">
                Create and manage subscription plans with module access control and dynamic pricing
              </p>
            </div>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)} size="lg" className="shadow-md">
            <Plus className="h-5 w-5 mr-2" />
            Create Plan
          </Button>
        </CardHeader>
        <CardContent className="pt-0">
          <SubscriptionPlansList 
            plans={plans}
            isLoading={isLoading}
            onSelectPlan={setSelectedPlanId}
            selectedPlanId={selectedPlanId}
          />
        </CardContent>
      </Card>

      {selectedPlanId && selectedPlan && (
        <div className="space-y-8">
          {/* Current Pricing Card */}
          <Card className="border-2 border-blue-200 bg-blue-50/30">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Settings2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Current Plan Pricing - {selectedPlan.name}
                  </CardTitle>
                  <p className="text-gray-600 mt-1">
                    Live pricing calculation based on enabled modules ({enabledModules.length} modules enabled)
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="font-semibold text-lg mb-4 text-gray-800">Monthly Pricing</h4>
                  <PricingDisplay
                    key={`monthly-${selectedPlanId}-${enabledModules.join(',')}`}
                    planId={selectedPlanId}
                    enabledModules={enabledModules}
                    billingCycle="monthly"
                    showBreakdown={true}
                  />
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="font-semibold text-lg mb-4 text-gray-800">Annual Pricing</h4>
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

          {/* Configuration Tabs */}
          <Card className="border-2 border-gray-200">
            <CardContent className="p-0">
              <Tabs defaultValue="modules" className="w-full">
                <div className="border-b border-gray-200 bg-gray-50/50">
                  <TabsList className="w-full justify-start h-14 bg-transparent p-0">
                    <TabsTrigger 
                      value="modules" 
                      className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 h-full px-8 text-base font-medium"
                    >
                      Module Permissions
                    </TabsTrigger>
                    <TabsTrigger 
                      value="pricing" 
                      className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 h-full px-8 text-base font-medium"
                    >
                      Module Pricing
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="modules" className="p-8">
                  <ModulePermissionsManager planId={selectedPlanId} />
                </TabsContent>

                <TabsContent value="pricing" className="p-8">
                  <ModulePricingManager />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
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
