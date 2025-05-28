
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, Building, User, Settings, Info, Calculator, Edit, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
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

  const enabledModules = permissionsSummary?.moduleDetails
    .filter(m => m.isEnabled)
    .map(m => m.name) || [];

  return (
    <>
      <Card 
        className={`cursor-pointer transition-all duration-200 hover:shadow-md border ${
          isSelected ? 'ring-1 ring-primary border-primary bg-primary/5' : 'border-border hover:border-primary/30'
        }`}
        onClick={onSelect}
      >
        <CardContent className="p-4 space-y-4">
          {/* Header Section */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="p-1.5 rounded-md bg-primary/10 text-primary flex-shrink-0">
                {getIcon(plan.plan_type)}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-sm truncate">{plan.name}</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Badge variant="outline" className="text-xs px-1.5 py-0 capitalize">
                    {plan.plan_type}
                  </Badge>
                  <Badge variant={plan.is_active ? 'default' : 'secondary'} className="text-xs px-1.5 py-0">
                    {plan.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 flex-shrink-0">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                  <Edit className="h-3 w-3 mr-2" />
                  Edit
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Description */}
          {plan.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {plan.description}
            </p>
          )}

          {/* Pricing Section */}
          <div className="space-y-2">
            {plan.use_module_pricing && (
              <div className="flex items-center gap-1 mb-1">
                <Calculator className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Dynamic Pricing</span>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Monthly</p>
                {plan.use_module_pricing ? (
                  <PricingDisplay
                    planId={plan.id}
                    enabledModules={enabledModules}
                    billingCycle="monthly"
                    showBreakdown={false}
                    compact={true}
                  />
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-semibold text-green-600">
                      {formatPrice(plan.price_monthly)}
                    </span>
                    <span className="text-xs text-muted-foreground">/mo</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Annual</p>
                {plan.use_module_pricing ? (
                  <PricingDisplay
                    planId={plan.id}
                    enabledModules={enabledModules}
                    billingCycle="annually"
                    showBreakdown={false}
                    compact={true}
                  />
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-semibold text-green-600">
                      {formatPrice(plan.price_annually)}
                    </span>
                    <span className="text-xs text-muted-foreground">/yr</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Module Permissions Summary */}
          {!isLoadingPermissions && permissionsSummary && (
            <div className="space-y-2 pt-3 border-t border-border">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-medium text-foreground">Module Access</h4>
                <ModulePermissionsTooltip moduleDetails={permissionsSummary.moduleDetails}>
                  <Info className="h-3 w-3 text-muted-foreground hover:text-foreground cursor-help transition-colors" />
                </ModulePermissionsTooltip>
              </div>
              
              <div className="flex flex-wrap gap-1">
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
            <div className="pt-3 border-t border-border">
              <div className="animate-pulse space-y-2">
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <Button 
            variant={isSelected ? 'default' : 'outline'}
            size="sm" 
            className="w-full h-8 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            {isSelected ? 'Selected' : 'Select Plan'}
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
