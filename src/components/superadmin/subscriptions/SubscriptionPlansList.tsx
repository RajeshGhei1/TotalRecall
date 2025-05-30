
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import { SubscriptionPlan } from '@/types/subscription-types';
import { PlanCard } from './plan-card';

interface SubscriptionPlansListProps {
  plans: SubscriptionPlan[];
  isLoading: boolean;
  onSelectPlan: (planId: string) => void;
  selectedPlanId: string | null;
}

const SubscriptionPlansList: React.FC<SubscriptionPlansListProps> = ({
  plans,
  isLoading,
  onSelectPlan,
  selectedPlanId
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse h-[500px] border-2 border-gray-200">
            <CardContent className="p-8 space-y-6">
              <div className="h-8 bg-gray-200 rounded-lg"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-24 bg-gray-200 rounded-xl"></div>
              <div className="h-20 bg-gray-200 rounded-lg"></div>
              <div className="h-12 bg-gray-200 rounded-lg"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="text-center py-16 bg-white border-2 border-dashed border-gray-300 rounded-2xl">
        <Settings className="h-16 w-16 mx-auto mb-6 text-gray-400" />
        <h3 className="text-xl font-semibold mb-3 text-gray-900">No subscription plans found</h3>
        <p className="text-gray-600">Create your first plan to get started with subscription management.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {plans.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          isSelected={selectedPlanId === plan.id}
          onSelect={() => onSelectPlan(plan.id)}
        />
      ))}
    </div>
  );
};

export default SubscriptionPlansList;
