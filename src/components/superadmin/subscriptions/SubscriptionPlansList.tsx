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
        className={`group cursor-pointer transition-all duration-200 hover:shadow-lg border ${
          isSelected 
            ? 'border-blue-300 bg-blue-50/30 shadow-md' 
            : 'border-gray-200 hover:border-blue-200'
        } h-full flex flex-col overflow-hidden`}
        onClick={onSelect}
      >
        <CardContent className="p-6 flex flex-col h-full">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className={`p-2.5 rounded-lg flex-shrink-0 transition-colors ${
                isSelected 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-gray-100 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600'
              }`}>
                {getIcon(plan.plan_type)}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-lg text-gray-900 mb-2 text-left leading-tight">
                  {plan.name}
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge 
                    variant="outline" 
                    className="text-xs px-2.5 py-1 capitalize bg-white border-gray-300 text-gray-600"
                  >
                    {plan.plan_type}
                  </Badge>
                  <Badge 
                    variant={plan.is_active ? 'default' : 'secondary'} 
                    className={`text-xs px-2.5 py-1 ${
                      plan.is_active 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
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
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Plan
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Description */}
          {plan.description && (
            <p className="text-sm text-gray-600 leading-relaxed mb-5 text-left">
              {plan.description}
            </p>
          )}

          {/* Pricing Section */}
          <div className="bg-gray-50/80 rounded-xl p-5 mb-5">
            {plan.use_module_pricing && (
              <div className="flex items-center gap-2 mb-4">
                <Calculator className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Dynamic Pricing</span>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly</span>
                <div className="text-right">
                  {plan.use_module_pricing ? (
                    <PricingDisplay
                      planId={plan.id}
                      enabledModules={enabledModules}
                      billingCycle="monthly"
                      showBreakdown={false}
                      compact={true}
                    />
                  ) : (
                    <>
                      <div className="text-xl font-bold text-gray-900">
                        {formatPrice(plan.price_monthly)}
                      </div>
                      <div className="text-xs text-gray-500">/month</div>
                    </>
                  )}
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Annual</span>
                  <div className="text-right">
                    {plan.use_module_pricing ? (
                      <PricingDisplay
                        planId={plan.id}
                        enabledModules={enabledModules}
                        billingCycle="annually"
                        showBreakdown={false}
                        compact={true}
                      />
                    ) : (
                      <>
                        <div className="text-xl font-bold text-gray-900">
                          {formatPrice(plan.price_annually)}
                        </div>
                        <div className="text-xs text-gray-500">/year</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Module Permissions Summary - Flex Grow */}
          <div className="flex-1">
            {!isLoadingPermissions && permissionsSummary && (
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-700">Module Access</h4>
                  <ModulePermissionsTooltip moduleDetails={permissionsSummary.moduleDetails}>
                    <Info className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help transition-colors" />
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

                <div className="max-w-full overflow-hidden">
                  <CollapsiblePermissionsSection moduleDetails={permissionsSummary.moduleDetails} />
                </div>
              </div>
            )}

            {isLoadingPermissions && (
              <div className="pt-4 border-t border-gray-100">
                <div className="animate-pulse space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            )}
          </div>

          {/* Action Button - Fixed at Bottom */}
          <div className="mt-5 pt-4 border-t border-gray-100">
            <Button 
              variant={isSelected ? 'default' : 'outline'}
              size="sm" 
              className={`w-full h-10 text-sm font-medium transition-all ${
                isSelected 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm' 
                  : 'border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700'
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
          </div>
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
          <Card key={i} className="animate-pulse h-96">
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
      <div className="text-center py-12 text-gray-500">
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
