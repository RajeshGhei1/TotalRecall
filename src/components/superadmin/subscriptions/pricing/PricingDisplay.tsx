
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
      <div className="flex items-center justify-center gap-2 animate-pulse">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <div className={`h-4 bg-gray-200 rounded ${compact ? 'w-16' : 'w-24'}`}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-amber-600 text-xs bg-amber-50 px-2 py-1 rounded border border-amber-200">
        Pricing calculation error
      </div>
    );
  }

  if (compact) {
    return (
      <div>
        <div className="text-xl font-bold text-green-600">
          {formatPrice(getCurrentPrice())}
        </div>
        <div className="text-xs text-muted-foreground">
          /{billingCycle === 'monthly' ? 'month' : 'year'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <DollarSign className="h-5 w-5 text-green-600" />
        <span className="text-3xl font-bold text-green-600">
          {formatPrice(getCurrentPrice())}
        </span>
        <span className="text-sm text-muted-foreground">
          /{billingCycle === 'monthly' ? 'month' : 'year'}
        </span>
      </div>

      {showBreakdown && pricing && (
        <Card className="border-dashed border-primary/20 bg-primary/5">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Calculator className="h-4 w-4" />
              Pricing Breakdown
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base plan:</span>
                <span className="font-medium">{formatPrice(getBasePrice())}</span>
              </div>
              
              {pricing.pricingBreakdown.map((module) => (
                <div key={module.name} className="flex justify-between">
                  <span className="text-muted-foreground capitalize">
                    {module.name.replace(/_/g, ' ')}:
                  </span>
                  <span className="font-medium">
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
                    <span className="font-medium">{formatPrice(getModulesPrice())}</span>
                  </div>
                </>
              )}
              
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold text-base">
                <span>Total:</span>
                <span className="text-green-600">{formatPrice(getCurrentPrice())}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {enabledModules.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Includes {enabledModules.length} modules:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {enabledModules.slice(0, 3).map((module) => (
              <Badge key={module} variant="secondary" className="text-xs px-2 py-1">
                {module.replace(/_/g, ' ')}
              </Badge>
            ))}
            {enabledModules.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-1">
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
