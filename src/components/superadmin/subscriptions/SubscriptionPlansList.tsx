
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, Building, User, Settings, Info, Calculator, Edit, MoreHorizontal, CheckCircle } from 'lucide-react';
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
        className={`group cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
          isSelected 
            ? 'ring-2 ring-primary/20 border-primary bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg' 
            : 'border-border hover:border-primary/40 hover:shadow-md'
        }`}
        onClick={onSelect}
      >
        <CardContent className="p-6 space-y-5">
          {/* Header Section */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className={`p-2.5 rounded-lg flex-shrink-0 transition-colors ${
                isSelected 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-primary/10 text-primary group-hover:bg-primary/15'
              }`}>
                {getIcon(plan.plan_type)}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-lg text-foreground truncate mb-1">{plan.name}</h3>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className="text-xs px-2 py-1 capitalize border-primary/30 text-primary bg-primary/5"
                  >
                    {plan.plan_type}
                  </Badge>
                  <Badge 
                    variant={plan.is_active ? 'default' : 'secondary'} 
                    className={`text-xs px-2 py-1 ${
                      plan.is_active 
                        ? 'bg-green-100 text-green-700 border-green-200' 
                        : 'bg-gray-100 text-gray-600 border-gray-200'
                    }`}
                  >
                    {plan.is_active ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                      </>
                    ) : (
                      'Inactive'
                    )}
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Plan
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Description */}
          {plan.description && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {plan.description}
            </p>
          )}

          {/* Pricing Section */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            {plan.use_module_pricing && (
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Dynamic Pricing Enabled</span>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-xs font-medium text-muted-foreground mb-2">Monthly</p>
                {plan.use_module_pricing ? (
                  <PricingDisplay
                    planId={plan.id}
                    enabledModules={enabledModules}
                    billingCycle="monthly"
                    showBreakdown={false}
                    compact={true}
                  />
                ) : (
                  <div>
                    <div className="text-xl font-bold text-green-600">
                      {formatPrice(plan.price_monthly)}
                    </div>
                    <div className="text-xs text-muted-foreground">/month</div>
                  </div>
                )}
              </div>
              
              <div className="text-center">
                <p className="text-xs font-medium text-muted-foreground mb-2">Annual</p>
                {plan.use_module_pricing ? (
                  <PricingDisplay
                    planId={plan.id}
                    enabledModules={enabledModules}
                    billingCycle="annually"
                    showBreakdown={false}
                    compact={true}
                  />
                ) : (
                  <div>
                    <div className="text-xl font-bold text-green-600">
                      {formatPrice(plan.price_annually)}
                    </div>
                    <div className="text-xs text-muted-foreground">/year</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Module Permissions Summary */}
          {!isLoadingPermissions && permissionsSummary && (
            <div className="space-y-3 pt-2 border-t border-gray-100">
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
            <div className="pt-2 border-t border-gray-100">
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
            className={`w-full h-9 text-sm font-medium transition-all ${
              isSelected 
                ? 'bg-primary hover:bg-primary/90 shadow-md' 
                : 'border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            {isSelected ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Selected Plan
              </>
            ) : (
              'Select Plan'
            )}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-6 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-20 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">No subscription plans found</h3>
        <p className="text-sm">Create your first plan to get started with subscription management.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
