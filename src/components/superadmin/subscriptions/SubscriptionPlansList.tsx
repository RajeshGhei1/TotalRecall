
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, Building, User, Settings, Info } from 'lucide-react';
import { SubscriptionPlan } from '@/types/subscription-types';
import { useModulePermissionsSummary } from '@/hooks/subscriptions/useModulePermissionsSummary';
import { 
  ModulePermissionBadge, 
  LimitationsBadge, 
  ModulePermissionsTooltip,
  CollapsiblePermissionsSection 
} from './permissions-summary';

interface SubscriptionPlansListProps {
  plans: SubscriptionPlan[];
  isLoading: boolean;
  onSelectPlan: (planId: string) => void;
  selectedPlanId: string | null;
}

const PlanCard: React.FC<{
  plan: SubscriptionPlan;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ plan, isSelected, onSelect }) => {
  const { data: permissionsSummary, isLoading: isLoadingPermissions } = useModulePermissionsSummary(plan.id);

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

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onSelect}
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
        
        <div className="space-y-2 mb-3">
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
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {plan.description}
          </p>
        )}

        {/* Module Permissions Summary */}
        {!isLoadingPermissions && permissionsSummary && (
          <div className="space-y-3 mb-3 pt-3 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Module Access</span>
              <ModulePermissionsTooltip moduleDetails={permissionsSummary.moduleDetails}>
                <Info className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
              </ModulePermissionsTooltip>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <ModulePermissionBadge
                enabledModules={permissionsSummary.enabledModules}
                totalModules={permissionsSummary.totalModules}
                enabledPercentage={permissionsSummary.enabledPercentage}
              />
              {permissionsSummary.keyLimitations.length > 0 && (
                <LimitationsBadge limitations={permissionsSummary.keyLimitations} />
              )}
            </div>

            <CollapsiblePermissionsSection moduleDetails={permissionsSummary.moduleDetails} />
          </div>
        )}

        {isLoadingPermissions && (
          <div className="pt-3 border-t">
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        )}

        <Button 
          variant={isSelected ? 'default' : 'outline'}
          size="sm" 
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
        >
          {isSelected ? 'Selected' : 'Manage Modules'}
        </Button>
      </CardContent>
    </Card>
  );
};

const SubscriptionPlansList: React.FC<SubscriptionPlansListProps> = ({
  plans,
  isLoading,
  onSelectPlan,
  selectedPlanId
}) => {
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
