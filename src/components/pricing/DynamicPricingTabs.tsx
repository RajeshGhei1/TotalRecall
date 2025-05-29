
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from 'lucide-react';
import { useSubscriptionPlans } from '@/hooks/subscriptions/useSubscriptionPlans';
import { useModulePermissionsSummary } from '@/hooks/subscriptions/useModulePermissionsSummary';
import { usePricingCalculation } from '@/hooks/subscriptions/usePricingEngine';
import DynamicPricingCard from './DynamicPricingCard';
import { SubscriptionPlan } from '@/types/subscription-types';

interface DynamicPricingTabsProps {
  planType: 'recruitment' | 'employer' | 'talent';
  currency: 'USD' | 'INR';
  formatPrice: (usdPrice: number) => string;
}

const DynamicPricingTabs: React.FC<DynamicPricingTabsProps> = ({ planType, currency, formatPrice }) => {
  const { plans, isLoading } = useSubscriptionPlans();
  
  // Filter plans by type and ensure they're active
  const filteredPlans = plans?.filter(plan => 
    plan.plan_type === planType && plan.is_active
  ).sort((a, b) => a.price_monthly - b.price_monthly) || [];

  const inrConversionRate = 83;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading pricing plans...</span>
      </div>
    );
  }

  if (filteredPlans.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No pricing plans available for {planType} users.</p>
      </div>
    );
  }

  return (
    <Tabs defaultValue="monthly" className="w-full">
      <div className="flex justify-center mb-8">
        <TabsList>
          <TabsTrigger value="monthly">Monthly Billing</TabsTrigger>
          <TabsTrigger value="annual">
            Annual Billing 
            <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
              Save 20%
            </span>
          </TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="monthly" className="space-y-8 mt-4 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-3 sm:gap-6">
        {filteredPlans.map((plan, index) => (
          <DynamicPricingCard
            key={plan.id}
            plan={plan}
            isPopular={index === 1 && filteredPlans.length >= 3}
            currency={currency}
            formatPrice={formatPrice}
            billingCycle="monthly"
          />
        ))}
      </TabsContent>
      
      <TabsContent value="annual" className="space-y-8 mt-4 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-3 sm:gap-6">
        {filteredPlans.map((plan, index) => (
          <DynamicPricingCard
            key={plan.id}
            plan={plan}
            isPopular={index === 1 && filteredPlans.length >= 3}
            currency={currency}
            formatPrice={formatPrice}
            billingCycle="annually"
            annualDiscount={true}
          />
        ))}
      </TabsContent>
    </Tabs>
  );
};

export default DynamicPricingTabs;
