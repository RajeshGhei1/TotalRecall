
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ModulePricing {
  id: string;
  module_name: string;
  base_price_monthly: number;
  base_price_annually: number;
  tier_pricing: unknown[];
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
      const { data, error } = await (supabase as unknown)
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
    queryKey: ['pricing-calculation', planId, enabledModules.sort().join(',')],
    queryFn: async (): Promise<PricingCalculation> => {
      console.log('Calculating pricing for plan:', planId, 'with modules:', enabledModules);
      
      // Get plan base pricing
      const { data: plan, error: planError } = await (supabase as unknown)
        .from('subscription_plans')
        .select('base_price_monthly, base_price_annually, use_module_pricing, price_monthly, price_annually')
        .eq('id', planId)
        .single();

      if (planError) throw planError;

      console.log('Plan data:', plan);

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

      console.log('Module pricing data:', modulePricing);
      console.log('Enabled modules:', enabledModules);

      if (modulePricing && enabledModules.length > 0) {
        enabledModules.forEach(moduleName => {
          const modulePrice = modulePricing.find(mp => mp.module_name === moduleName && mp.is_active);
          console.log(`Looking for module: ${moduleName}, found:`, modulePrice);
          
          if (modulePrice) {
            const monthlyPrice = Number(modulePrice.base_price_monthly) || 0;
            const annualPrice = Number(modulePrice.base_price_annually) || 0;
            
            modulesPriceMonthly += monthlyPrice;
            modulesPriceAnnually += annualPrice;
            pricingBreakdown.push({
              name: moduleName,
              priceMonthly: monthlyPrice,
              priceAnnually: annualPrice
            });
          }
        });
      }

      const result = {
        basePriceMonthly,
        basePriceAnnually,
        modulesPriceMonthly,
        modulesPriceAnnually,
        totalPriceMonthly: basePriceMonthly + modulesPriceMonthly,
        totalPriceAnnually: basePriceAnnually + modulesPriceAnnually,
        enabledModules,
        pricingBreakdown
      };

      console.log('Final pricing calculation:', result);
      return result;
    },
    enabled: !!planId && !!modulePricing,
    refetchOnWindowFocus: false,
    staleTime: 0 // Always refetch to ensure latest pricing
  });
};
