
import React from 'react';
import { Calculator } from 'lucide-react';
import PricingDisplay from '../pricing/PricingDisplay';

interface PlanCardPricingProps {
  plan: {
    id: string;
    price_monthly: number;
    price_annually: number;
    use_module_pricing?: boolean;
  };
  enabledModules: string[];
}

const PlanCardPricing: React.FC<PlanCardPricingProps> = ({ plan, enabledModules }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
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
  );
};

export default PlanCardPricing;
