import React, { useMemo } from 'react';
import { Check, Zap, Building, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSubscriptionPlans } from '@/hooks/subscriptions/useSubscriptionPlans';
import { useModulePermissionsSummary } from '@/hooks/subscriptions/useModulePermissionsSummary';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SubscriptionPlan } from '@/types/subscription-types';

// Component to render individual plan card
const PlanCard: React.FC<{ plan: SubscriptionPlan }> = ({ plan }) => {
  const { data: modulesSummary } = useModulePermissionsSummary(plan.id);
  
  const enabledModules = modulesSummary?.enabledModules || 0;
  const totalModules = modulesSummary?.totalModules || 0;
  const enabledModuleNames = modulesSummary?.moduleDetails
    ?.filter(m => m.isEnabled)
    .slice(0, 8) // Show first 8 apps
    .map(m => m.label) || [];

  // Calculate annual savings
  const monthlyAnnualCost = plan.price_monthly * 12;
  const annualSavings = monthlyAnnualCost - plan.price_annually;
  const savingsPercentage = monthlyAnnualCost > 0 
    ? Math.round((annualSavings / monthlyAnnualCost) * 100) 
    : 0;

  const getPlanIcon = (planType: string) => {
    switch (planType) {
      case 'recruitment':
        return Zap;
      case 'employer':
        return Building;
      case 'talent':
        return Shield;
      default:
        return Building;
    }
  };

  const getPlanColor = (planType: string) => {
    switch (planType) {
      case 'recruitment':
        return 'from-blue-500 to-blue-600';
      case 'employer':
        return 'from-green-500 to-green-600';
      case 'talent':
        return 'from-purple-500 to-purple-600';
      default:
        return 'from-indigo-500 to-indigo-600';
    }
  };

  const PlanIcon = getPlanIcon(plan.plan_type);
  const gradientColor = getPlanColor(plan.plan_type);

  return (
    <Card 
      className="relative overflow-hidden border-2 hover:border-indigo-300 transition-all hover:shadow-xl"
    >
      {/* Gradient Header */}
      <div className={`bg-gradient-to-r ${gradientColor} text-white p-6`}>
        <div className="flex items-center gap-3 mb-2">
          <PlanIcon className="h-6 w-6" />
          <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
        </div>
        {plan.description && (
          <CardDescription className="text-white/90 mt-2">
            {plan.description}
          </CardDescription>
        )}
      </div>

      <CardHeader className="pb-4">
        {/* Pricing */}
        <div className="text-center mb-4">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-4xl font-bold text-gray-900">
              ${plan.price_monthly}
            </span>
            <span className="text-gray-600">/month</span>
          </div>
          {plan.price_annually > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                ${plan.price_annually}/year
              </p>
              {savingsPercentage > 0 && (
                <Badge variant="secondary" className="mt-1 bg-green-100 text-green-800">
                  Save {savingsPercentage}% annually
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Apps Count */}
        <div className="bg-indigo-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600 mb-1">Included Apps</p>
          <p className="text-2xl font-bold text-indigo-600">
            {enabledModules} {enabledModules === 1 ? 'App' : 'Apps'}
          </p>
          {totalModules > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              out of {totalModules} available
            </p>
          )}
        </div>

        {/* Included Apps List */}
        {enabledModuleNames.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-3">
              Key Apps Included:
            </p>
            <ul className="space-y-2">
              {enabledModuleNames.map((moduleName, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{moduleName}</span>
                </li>
              ))}
              {enabledModules > enabledModuleNames.length && (
                <li className="text-sm text-gray-500 italic pl-6">
                  +{enabledModules - enabledModuleNames.length} more apps
                </li>
              )}
            </ul>
          </div>
        )}

        {/* CTA Button */}
        <div className="pt-4 border-t">
          <Button 
            asChild 
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            <Link to="/auth">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const SubscriptionPlansShowcase: React.FC = () => {
  const { plans, isLoading } = useSubscriptionPlans();

  // Filter only active plans
  const activePlans = useMemo(() => {
    return plans.filter(plan => plan.is_active);
  }, [plans]);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading subscription plans...</p>
          </div>
        </div>
      </div>
    );
  }

  if (activePlans.length === 0) {
    return null; // Don't show section if no plans
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-16" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-2">
            Select the perfect subscription plan for your business needs. All plans include access to our comprehensive app suite.
          </p>
          <p className="text-sm text-gray-500">
            Get started today and unlock the full potential of Total Recall AI
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {activePlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            All plans include 24/7 support, regular updates, and access to our AI-powered features
          </p>
          <Link 
            to="/pricing" 
            className="text-indigo-600 hover:text-indigo-700 font-medium text-sm inline-flex items-center gap-1"
          >
            View detailed pricing
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlansShowcase;
