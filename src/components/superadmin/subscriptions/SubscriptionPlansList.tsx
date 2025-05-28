
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, Building, User, Settings } from 'lucide-react';
import { SubscriptionPlan } from '@/types/subscription-types';

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
  const getIcon = (planType: string) => {
    switch (planType) {
      case 'recruitment':
        return <Building className="h-4 w-4" />;
      case 'employer':
        return <Crown className="h-4 w-4" />;
      case 'talent':
        return <User className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No subscription plans found. Create your first plan to get started.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {plans.map((plan) => (
        <Card 
          key={plan.id} 
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedPlanId === plan.id ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => onSelectPlan(plan.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getIcon(plan.plan_type)}
                <h3 className="font-semibold">{plan.name}</h3>
              </div>
              <Badge variant={plan.is_active ? 'default' : 'secondary'}>
                {plan.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Monthly:</span>
                <span className="font-medium">{formatPrice(plan.price_monthly)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Annual:</span>
                <span className="font-medium">{formatPrice(plan.price_annually)}</span>
              </div>
            </div>

            {plan.description && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {plan.description}
              </p>
            )}

            <Button 
              variant={selectedPlanId === plan.id ? 'default' : 'outline'}
              size="sm" 
              className="w-full mt-3"
              onClick={(e) => {
                e.stopPropagation();
                onSelectPlan(plan.id);
              }}
            >
              {selectedPlanId === plan.id ? 'Selected' : 'Manage Modules'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SubscriptionPlansList;
