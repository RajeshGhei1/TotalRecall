
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { DollarSign, Calculator, Loader2 } from 'lucide-react';
import { usePricingCalculation } from '@/hooks/subscriptions/usePricingEngine';

interface PricingDisplayProps {
  planId: string;
  enabledModules: string[];
  billingCycle?: 'monthly' | 'annually';
  showBreakdown?: boolean;
  compact?: boolean;
}

const PricingDisplay: React.FC<PricingDisplayProps> = ({
  planId,
  enabledModules,
  billingCycle = 'monthly',
  showBreakdown = false,
  compact = false
}) => {
  const { data: pricing, isLoading, error } = usePricingCalculation(planId, enabledModules);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getCurrentPrice = () => {
    if (!pricing) return 0;
    return billingCycle === 'monthly' ? pricing.totalPriceMonthly : pricing.totalPriceAnnually;
  };

  const getBasePrice = () => {
    if (!pricing) return 0;
    return billingCycle === 'monthly' ? pricing.basePriceMonthly : pricing.basePriceAnnually;
  };

  const getModulesPrice = () => {
    if (!pricing) return 0;
    return billingCycle === 'monthly' ? pricing.modulesPriceMonthly : pricing.modulesPriceAnnually;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2">
        <Loader2 className="h-3 w-3 animate-spin text-gray-400" />
        <div className={`h-3 bg-gray-200 rounded animate-pulse ${compact ? 'w-12' : 'w-16'}`}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-amber-600 text-xs bg-amber-50 px-2 py-1 rounded border border-amber-200">
        Error
      </div>
    );
  }

  if (compact) {
    return (
      <div className="text-right">
        <div className="text-lg font-bold text-gray-900">
          {formatPrice(getCurrentPrice())}
        </div>
        <div className="text-xs text-gray-500">
          /{billingCycle === 'monthly' ? 'month' : 'year'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <DollarSign className="h-5 w-5 text-emerald-600" />
        <span className="text-3xl font-bold text-emerald-600">
          {formatPrice(getCurrentPrice())}
        </span>
        <span className="text-sm text-gray-500">
          /{billingCycle === 'monthly' ? 'month' : 'year'}
        </span>
      </div>

      {showBreakdown && pricing && (
        <Card className="border-dashed border-blue-200 bg-blue-50/50">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-700">
              <Calculator className="h-4 w-4" />
              Pricing Breakdown
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Base plan:</span>
                <span className="font-medium text-gray-900">{formatPrice(getBasePrice())}</span>
              </div>
              
              {pricing.pricingBreakdown.map((module) => (
                <div key={module.name} className="flex justify-between">
                  <span className="text-gray-600 capitalize">
                    {module.name.replace(/_/g, ' ')}:
                  </span>
                  <span className="font-medium text-gray-900">
                    {formatPrice(
                      billingCycle === 'monthly' ? module.priceMonthly : module.priceAnnually
                    )}
                  </span>
                </div>
              ))}
              
              {getModulesPrice() > 0 && (
                <>
                  <Separator className="my-2" />
                  <div className="flex justify-between">
                    <span className="text-gray-600">Modules total:</span>
                    <span className="font-medium text-gray-900">{formatPrice(getModulesPrice())}</span>
                  </div>
                </>
              )}
              
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold text-base">
                <span className="text-gray-900">Total:</span>
                <span className="text-emerald-600">{formatPrice(getCurrentPrice())}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {enabledModules.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-600">
            Includes {enabledModules.length} modules:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {enabledModules.slice(0, 3).map((module) => (
              <Badge key={module} variant="secondary" className="text-xs px-2 py-1 bg-gray-100 text-gray-700">
                {module.replace(/_/g, ' ')}
              </Badge>
            ))}
            {enabledModules.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-1 border-gray-300 text-gray-600">
                +{enabledModules.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingDisplay;
