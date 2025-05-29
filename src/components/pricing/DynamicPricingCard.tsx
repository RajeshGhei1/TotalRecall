
import React from 'react';
import { Crown, Tag } from 'lucide-react';
import { SubscriptionPlan } from '@/types/subscription-types';
import { useModulePermissionsSummary } from '@/hooks/subscriptions/useModulePermissionsSummary';
import { usePricingCalculation } from '@/hooks/subscriptions/usePricingEngine';
import PricingCard from './PricingCard';

interface DynamicPricingCardProps {
  plan: SubscriptionPlan;
  isPopular?: boolean;
  currency: 'USD' | 'INR';
  formatPrice: (usdPrice: number) => string;
  billingCycle: 'monthly' | 'annually';
  annualDiscount?: boolean;
}

const DynamicPricingCard: React.FC<DynamicPricingCardProps> = ({
  plan,
  isPopular = false,
  currency,
  formatPrice,
  billingCycle,
  annualDiscount = false
}) => {
  const { data: modulesSummary } = useModulePermissionsSummary(plan.id);
  
  // Get enabled modules for pricing calculation
  const enabledModules = React.useMemo(() => {
    return modulesSummary?.moduleDetails
      .filter(module => module.isEnabled)
      .map(module => module.name) || [];
  }, [modulesSummary]);

  const { data: pricing } = usePricingCalculation(plan.id, enabledModules);

  // Calculate final price based on billing cycle and any discounts
  const getFinalPrice = () => {
    if (!pricing) {
      // Fallback to plan's fixed pricing if dynamic pricing isn't available
      return billingCycle === 'monthly' 
        ? plan.price_monthly 
        : (annualDiscount ? plan.price_annually * 0.8 : plan.price_annually);
    }

    const basePrice = billingCycle === 'monthly' 
      ? pricing.totalPriceMonthly 
      : pricing.totalPriceAnnually;
    
    return annualDiscount && billingCycle === 'annually' ? basePrice * 0.8 : basePrice;
  };

  const getAnnualPrice = () => {
    const monthlyPrice = getFinalPrice();
    return billingCycle === 'monthly' ? monthlyPrice * 12 : monthlyPrice;
  };

  // Generate features from module permissions
  const generateFeatures = () => {
    const features = [];
    
    if (modulesSummary?.moduleDetails) {
      const enabledModulesCount = modulesSummary.moduleDetails.filter(m => m.isEnabled).length;
      features.push({ text: `Access to ${enabledModulesCount} core modules` });
      
      // Add specific module features
      modulesSummary.moduleDetails
        .filter(m => m.isEnabled)
        .slice(0, 5) // Limit to first 5 modules
        .forEach(module => {
          features.push({ text: module.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) });
        });
    } else {
      // Fallback features based on plan type and tier
      if (plan.price_monthly === 0) {
        features.push({ text: "Basic access" });
        features.push({ text: "Standard support" });
      } else if (plan.price_monthly < 100) {
        features.push({ text: "Essential features" });
        features.push({ text: "Email support" });
        features.push({ text: "Basic reporting" });
      } else if (plan.price_monthly < 300) {
        features.push({ text: "Advanced features" });
        features.push({ text: "Priority support" });
        features.push({ text: "Advanced analytics" });
        features.push({ text: "API access" });
      } else {
        features.push({ text: "All premium features" });
        features.push({ text: "24/7 dedicated support" });
        features.push({ text: "Custom integrations" });
        features.push({ text: "Advanced API access" });
        features.push({ text: "Custom branding" });
      }
    }

    return features;
  };

  const getIconType = () => {
    if (plan.price_monthly === 0) return "tag";
    if (plan.price_monthly < 200) return "crown";
    return "crownSecondary";
  };

  const getButtonText = () => {
    if (plan.price_monthly === 0) return "Get Started";
    if (plan.price_monthly >= 500) return "Contact Sales";
    return "Get Started";
  };

  const finalPrice = getFinalPrice();
  const annualPrice = getAnnualPrice();
  const inrConversionRate = 83;

  return (
    <PricingCard
      title={plan.name}
      price={finalPrice === 0 ? "Free" : formatPrice(finalPrice)}
      description={plan.description || `${plan.name} plan features`}
      iconType={getIconType()}
      isPopular={isPopular}
      features={generateFeatures()}
      buttonText={getButtonText()}
      buttonVariant={isPopular ? "default" : "outline"}
      annualBilling={annualDiscount && billingCycle === 'annually'}
      annualPrice={
        annualDiscount && billingCycle === 'annually' 
          ? `(${currency === 'USD' ? '$' : '₹'}${currency === 'USD' 
              ? Math.round(annualPrice) 
              : Math.round(annualPrice * inrConversionRate / 10) * 10}/year)`
          : undefined
      }
    />
  );
};

export default DynamicPricingCard;
