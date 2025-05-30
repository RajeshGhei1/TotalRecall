
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
        className={`group cursor-pointer transition-all duration-300 hover:shadow-xl border-2 ${
          isSelected 
            ? 'border-blue-400 bg-blue-50/40 shadow-lg ring-2 ring-blue-100' 
            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50/50'
        } h-full flex flex-col overflow-hidden`}
        onClick={onSelect}
      >
        <CardContent className="p-8 flex flex-col h-full space-y-6">
          {/* Header Section */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 min-w-0 flex-1">
              <div className={`p-3 rounded-xl flex-shrink-0 transition-all duration-200 ${
                isSelected 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
              }`}>
                {getIcon(plan.plan_type)}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-xl text-gray-900 mb-3 text-left leading-tight">
                  {plan.name}
                </h3>
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge 
                    variant="outline" 
                    className="text-sm px-3 py-1 capitalize bg-white border-gray-300 text-gray-700 font-medium"
                  >
                    {plan.plan_type}
                  </Badge>
                  <Badge 
                    variant={plan.is_active ? 'default' : 'secondary'} 
                    className={`text-sm px-3 py-1 font-medium ${
                      plan.is_active 
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                        : 'bg-gray-100 text-gray-600 border-gray-300'
                    }`}
                  >
                    {plan.is_active ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1.5" />
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
                  className="h-10 w-10 p-0 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-gray-100"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Plan
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Description */}
          {plan.description && (
            <p className="text-gray-600 leading-relaxed text-left border-l-4 border-gray-200 pl-4">
              {plan.description}
            </p>
          )}

          {/* Pricing Section */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200 rounded-2xl p-6">
            {plan.use_module_pricing && (
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calculator className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-semibold text-blue-700">Dynamic Pricing Enabled</span>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Monthly</p>
                {plan.use_module_pricing ? (
                  <PricingDisplay
                    planId={plan.id}
                    enabledModules={enabledModules}
                    billingCycle="monthly"
                    showBreakdown={false}
                    compact={true}
                  />
                ) : (
                  <div className="text-2xl font-bold text-gray-900">
                    {formatPrice(plan.price_monthly)}
                  </div>
                )}
              </div>
              
              <div className="text-center border-l border-gray-300 pl-6">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Annual</p>
                {plan.use_module_pricing ? (
                  <PricingDisplay
                    planId={plan.id}
                    enabledModules={enabledModules}
                    billingCycle="annually"
                    showBreakdown={false}
                    compact={true}
                  />
                ) : (
                  <div className="text-2xl font-bold text-gray-900">
                    {formatPrice(plan.price_annually)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Module Permissions Summary - Flex Grow */}
          <div className="flex-1 space-y-4">
            {!isLoadingPermissions && permissionsSummary && (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-800">Module Access</h4>
                  <ModulePermissionsTooltip moduleDetails={permissionsSummary.moduleDetails}>
                    <div className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-help">
                      <Info className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    </div>
                  </ModulePermissionsTooltip>
                </div>
                
                <div className="flex flex-wrap gap-3">
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
              </>
            )}

            {isLoadingPermissions && (
              <div className="space-y-4">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            )}
          </div>

          {/* Action Button - Fixed at Bottom */}
          <div className="pt-6 border-t border-gray-200">
            <Button 
              variant={isSelected ? 'default' : 'outline'}
              size="lg" 
              className={`w-full h-12 text-base font-semibold transition-all duration-200 ${
                isSelected 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' 
                  : 'border-2 border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
            >
              {isSelected ? (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
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
