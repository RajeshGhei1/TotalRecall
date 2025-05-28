
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, Building, User, Settings, Info, Calculator, Edit } from 'lucide-react';
import { SubscriptionPlan } from '@/types/subscription-types';
import { useModulePermissionsSummary } from '@/hooks/subscriptions/useModulePermissionsSummary';
import { 
  ModulePermissionBadge, 
  LimitationsBadge, 
  ModulePermissionsTooltip,
  CollapsiblePermissionsSection 
} from './permissions-summary';
import PricingDisplay from './pricing/PricingDisplay';
import EditPlanDialog from './EditPlanDialog';

interface SubscriptionPlansListProps {
  plans: SubscriptionPlan[];
  isLoading: boolean;
  onSelectPlan: (planId: string) => void;
  selectedPlanId: string | null;
}

const PlanCard: React.FC<{
  plan: SubscriptionPlan & { use_module_pricing?: boolean };
  isSelected: boolean;
  onSelect: () => void;
}> = ({ plan, isSelected, onSelect }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { data: permissionsSummary, isLoading: isLoadingPermissions } = useModulePermissionsSummary(plan.id);

  const getIcon = (planType: string) => {
    switch (planType) {
      case 'recruitment':
        return <Building className="h-5 w-5" />;
      case 'employer':
        return <Crown className="h-5 w-5" />;
      case 'talent':
        return <User className="h-5 w-5" />;
      default:
        return <Settings className="h-5 w-5" />;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const enabledModules = permissionsSummary?.moduleDetails
    .filter(m => m.isEnabled)
    .map(m => m.name) || [];

  return (
    <>
      <Card 
        className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
          isSelected ? 'ring-2 ring-primary border-primary' : 'border-border hover:border-primary/50'
        }`}
        onClick={onSelect}
      >
        <CardContent className="p-6">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                {getIcon(plan.plan_type)}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{plan.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs capitalize">
                    {plan.plan_type}
                  </Badge>
                  {plan.use_module_pricing && (
                    <Badge variant="secondary" className="text-xs">
                      <Calculator className="h-3 w-3 mr-1" />
                      Dynamic Pricing
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditDialogOpen(true);
                }}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Badge variant={plan.is_active ? 'default' : 'secondary'}>
                {plan.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>

          {/* Description */}
          {plan.description && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {plan.description}
            </p>
          )}

          {/* Pricing Section */}
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-3 text-foreground">Pricing</h4>
            {plan.use_module_pricing ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">Monthly</p>
                  <PricingDisplay
                    planId={plan.id}
                    enabledModules={enabledModules}
                    billingCycle="monthly"
                    showBreakdown={false}
                    compact={true}
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">Annual</p>
                  <PricingDisplay
                    planId={plan.id}
                    enabledModules={enabledModules}
                    billingCycle="annually"
                    showBreakdown={false}
                    compact={true}
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">Monthly</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-green-600">
                      {formatPrice(plan.price_monthly)}
                    </span>
                    <span className="text-xs text-muted-foreground">/mo</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">Annual</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-green-600">
                      {formatPrice(plan.price_annually)}
                    </span>
                    <span className="text-xs text-muted-foreground">/yr</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Module Permissions Summary */}
          {!isLoadingPermissions && permissionsSummary && (
            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-foreground">Module Access</h4>
                <ModulePermissionsTooltip moduleDetails={permissionsSummary.moduleDetails}>
                  <Info className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help transition-colors" />
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
            <div className="pt-4 border-t border-border">
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <Button 
            variant={isSelected ? 'default' : 'outline'}
            size="sm" 
            className="w-full mt-4"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            {isSelected ? 'Selected Plan' : 'Select Plan'}
          </Button>
        </CardContent>
      </Card>

      <EditPlanDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        plan={plan}
      />
    </>
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
