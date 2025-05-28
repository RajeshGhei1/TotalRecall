
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
      <div className="flex items-center gap-2 animate-pulse">
        <Loader2 className="h-4 w-4 animate-spin" />
        <div className={`h-6 bg-gray-200 rounded ${compact ? 'w-16' : 'w-24'}`}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-sm">
        Error calculating pricing
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-bold text-green-600">
          {formatPrice(getCurrentPrice())}
        </span>
        <span className="text-xs text-muted-foreground">
          /{billingCycle === 'monthly' ? 'mo' : 'yr'}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <DollarSign className="h-4 w-4 text-green-600" />
        <span className="text-2xl font-bold text-green-600">
          {formatPrice(getCurrentPrice())}
        </span>
        <span className="text-sm text-muted-foreground">
          /{billingCycle === 'monthly' ? 'month' : 'year'}
        </span>
      </div>

      {showBreakdown && pricing && (
        <Card className="border-dashed">
          <CardContent className="p-3 space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Calculator className="h-3 w-3" />
              Pricing Breakdown
            </div>
            
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base plan:</span>
                <span>{formatPrice(getBasePrice())}</span>
              </div>
              
              {pricing.pricingBreakdown.map((module) => (
                <div key={module.name} className="flex justify-between">
                  <span className="text-muted-foreground capitalize">
                    {module.name.replace(/_/g, ' ')}:
                  </span>
                  <span>
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
                    <span className="text-muted-foreground">Modules total:</span>
                    <span>{formatPrice(getModulesPrice())}</span>
                  </div>
                </>
              )}
              
              <Separator className="my-2" />
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span className="text-green-600">{formatPrice(getCurrentPrice())}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {enabledModules.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Includes {enabledModules.length} modules:</p>
          <div className="flex flex-wrap gap-1">
            {enabledModules.slice(0, 3).map((module) => (
              <Badge key={module} variant="secondary" className="text-xs">
                {module.replace(/_/g, ' ')}
              </Badge>
            ))}
            {enabledModules.length > 3 && (
              <Badge variant="outline" className="text-xs">
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
