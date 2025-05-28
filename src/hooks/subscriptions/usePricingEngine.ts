
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ModulePricing {
  id: string;
  module_name: string;
  base_price_monthly: number;
  base_price_annually: number;
  tier_pricing: any[];
  is_active: boolean;
}

export interface PricingCalculation {
  basePriceMonthly: number;
  basePriceAnnually: number;
  modulesPriceMonthly: number;
  modulesPriceAnnually: number;
  totalPriceMonthly: number;
  totalPriceAnnually: number;
  enabledModules: string[];
  pricingBreakdown: Array<{
    name: string;
    priceMonthly: number;
    priceAnnually: number;
  }>;
}

export const useModulePricing = () => {
  return useQuery({
    queryKey: ['module-pricing'],
    queryFn: async (): Promise<ModulePricing[]> => {
      const { data, error } = await (supabase as any)
        .from('module_pricing')
        .select('*')
        .eq('is_active', true)
        .order('module_name');

      if (error) throw error;
      return data || [];
    }
  });
};

export const usePricingCalculation = (planId: string, enabledModules: string[] = []) => {
  const { data: modulePricing } = useModulePricing();
  
  return useQuery({
    queryKey: ['pricing-calculation', planId, enabledModules, modulePricing?.length],
    queryFn: async (): Promise<PricingCalculation> => {
      // Get plan base pricing
      const { data: plan, error: planError } = await (supabase as any)
        .from('subscription_plans')
        .select('base_price_monthly, base_price_annually, use_module_pricing, price_monthly, price_annually')
        .eq('id', planId)
        .single();

      if (planError) throw planError;

      // If not using module pricing, return the fixed prices
      if (!plan?.use_module_pricing) {
        return {
          basePriceMonthly: plan?.price_monthly || 0,
          basePriceAnnually: plan?.price_annually || 0,
          modulesPriceMonthly: 0,
          modulesPriceAnnually: 0,
          totalPriceMonthly: plan?.price_monthly || 0,
          totalPriceAnnually: plan?.price_annually || 0,
          enabledModules: [],
          pricingBreakdown: []
        };
      }

      const basePriceMonthly = plan?.base_price_monthly || 0;
      const basePriceAnnually = plan?.base_price_annually || 0;

      // Calculate module pricing
      let modulesPriceMonthly = 0;
      let modulesPriceAnnually = 0;
      const pricingBreakdown: Array<{
        name: string;
        priceMonthly: number;
        priceAnnually: number;
      }> = [];

      if (modulePricing) {
        enabledModules.forEach(moduleName => {
          const modulePrice = modulePricing.find(mp => mp.module_name === moduleName);
          if (modulePrice) {
            modulesPriceMonthly += modulePrice.base_price_monthly;
            modulesPriceAnnually += modulePrice.base_price_annually;
            pricingBreakdown.push({
              name: moduleName,
              priceMonthly: modulePrice.base_price_monthly,
              priceAnnually: modulePrice.base_price_annually
            });
          }
        });
      }

      return {
        basePriceMonthly,
        basePriceAnnually,
        modulesPriceMonthly,
        modulesPriceAnnually,
        totalPriceMonthly: basePriceMonthly + modulesPriceMonthly,
        totalPriceAnnually: basePriceAnnually + modulesPriceAnnually,
        enabledModules,
        pricingBreakdown
      };
    },
    enabled: !!planId && !!modulePricing
  });
};
