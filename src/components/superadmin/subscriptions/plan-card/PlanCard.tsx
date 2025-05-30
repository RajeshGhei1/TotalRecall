
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { SubscriptionPlan } from '@/types/subscription-types';
import { useModulePermissionsSummary } from '@/hooks/subscriptions/useModulePermissionsSummary';
import EditPlanDialog from '../EditPlanDialog';
import PlanCardHeader from './PlanCardHeader';
import PlanCardPricing from './PlanCardPricing';
import PlanCardPermissions from './PlanCardPermissions';

interface PlanCardProps {
  plan: SubscriptionPlan & { use_module_pricing?: boolean };
  isSelected: boolean;
  onSelect: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, isSelected, onSelect }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { data: permissionsSummary, isLoading: isLoadingPermissions } = useModulePermissionsSummary(plan.id);

  const enabledModules = permissionsSummary?.moduleDetails
    .filter(m => m.isEnabled)
    .map(m => m.name) || [];

  return (
    <>
      <Card 
        className={`group cursor-pointer transition-all duration-300 hover:shadow-xl ${
          isSelected 
            ? 'border-blue-500 bg-blue-50/50 shadow-lg ring-2 ring-blue-200' 
            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50/50'
        } h-full flex flex-col overflow-hidden`}
        onClick={onSelect}
      >
        <CardContent className="p-6 flex flex-col h-full space-y-6">
          <PlanCardHeader 
            plan={plan}
            isSelected={isSelected}
            onEditClick={() => setIsEditDialogOpen(true)}
          />

          {/* Description */}
          {plan.description && (
            <p className="text-gray-600 leading-relaxed text-left border-l-4 border-gray-200 pl-4">
              {plan.description}
            </p>
          )}

          {/* Pricing Section */}
          <PlanCardPricing plan={plan} enabledModules={enabledModules} />

          {/* Module Permissions Summary - Flex Grow */}
          <div className="flex-1 space-y-4">
            <PlanCardPermissions 
              permissionsSummary={permissionsSummary}
              isLoading={isLoadingPermissions}
            />
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

export default PlanCard;
