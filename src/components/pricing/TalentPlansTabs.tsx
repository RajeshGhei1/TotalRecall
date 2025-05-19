
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PricingCard from './PricingCard';

interface TalentPlansTabsProps {
  currency: 'USD' | 'INR';
  formatPrice: (usdPrice: number) => string;
}

const TalentPlansTabs: React.FC<TalentPlansTabsProps> = ({ currency, formatPrice }) => {
  const inrConversionRate = 83;
  
  return (
    <Tabs defaultValue="monthly" className="w-full">
      <div className="flex justify-center mb-8">
        <TabsList>
          <TabsTrigger value="monthly">Monthly Billing</TabsTrigger>
          <TabsTrigger value="annual">Annual Billing <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Save 20%</span></TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="monthly" className="space-y-8 mt-4 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-3 sm:gap-6">
        {/* Free Plan */}
        <PricingCard
          title="Free"
          price="Free"
          description="Basic job search"
          iconType="tag"
          features={[
            { text: "Basic profile creation" },
            { text: "Job search & alerts" },
            { text: "Apply to jobs" },
            { text: "Limited application tracking" },
            { text: "Basic community access" }
          ]}
          buttonText="Get Started"
          buttonVariant="outline"
        />
        
        {/* Plus Plan */}
        <PricingCard
          title="Plus"
          price={formatPrice(9.99)}
          description="Enhanced job search & visibility"
          iconType="crown"
          isPopular={true}
          features={[
            { text: "Everything in Free plan" },
            { text: "Enhanced profile visibility" },
            { text: "AI resume optimization" },
            { text: "Priority application status" },
            { text: "See who viewed your profile" },
            { text: "Direct message to recruiters (5/month)" },
            { text: "Full community access" }
          ]}
          buttonText="Get Started"
          buttonVariant="default"
        />
        
        {/* Pro Plan */}
        <PricingCard
          title="Pro"
          price={formatPrice(29.99)}
          description="Career acceleration & networking"
          iconType="crownSecondary"
          features={[
            { text: "Everything in Plus plan" },
            { text: "Featured candidate status" },
            { text: "Unlimited direct messages" },
            { text: "1:1 career coaching session (monthly)" },
            { text: "Advanced salary insights" },
            { text: "AI interview preparation" },
            { text: "Early access to exclusive jobs" },
            { text: "Premium workshops & webinars" }
          ]}
          buttonText="Get Started"
          buttonVariant="outline"
        />
      </TabsContent>
      
      <TabsContent value="annual" className="space-y-8 mt-4 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-3 sm:gap-6">
        {/* Annual billing plans for talent */}
        <PricingCard
          title="Free"
          price="Free"
          description="Basic job search"
          iconType="tag"
          features={[
            { text: "Basic profile creation" },
            { text: "Job search & alerts" },
            { text: "Apply to jobs" },
            { text: "Limited application tracking" },
            { text: "Basic community access" }
          ]}
          buttonText="Get Started"
          buttonVariant="outline"
        />
        
        <PricingCard
          title="Plus"
          price={formatPrice(7.99)}
          description="Billed annually"
          annualBilling={true}
          annualPrice={`(${currency === 'USD' ? '$95.88' : '₹' + Math.round(95.88 * inrConversionRate / 10) * 10}/year)`}
          iconType="crown"
          isPopular={true}
          features={[
            { text: "Everything in Free plan" },
            { text: "Enhanced profile visibility" },
            { text: "AI resume optimization" },
            { text: "Priority application status" },
            { text: "See who viewed your profile" },
            { text: "Direct message to recruiters (5/month)" },
            { text: "Full community access" }
          ]}
          buttonText="Get Started"
          buttonVariant="default"
        />
        
        <PricingCard
          title="Pro"
          price={formatPrice(23.99)}
          description="Billed annually"
          annualBilling={true}
          annualPrice={`(${currency === 'USD' ? '$287.88' : '₹' + Math.round(287.88 * inrConversionRate / 10) * 10}/year)`}
          iconType="crownSecondary"
          features={[
            { text: "Everything in Plus plan" },
            { text: "Featured candidate status" },
            { text: "Unlimited direct messages" },
            { text: "1:1 career coaching session (monthly)" },
            { text: "Advanced salary insights" },
            { text: "AI interview preparation" },
            { text: "Early access to exclusive jobs" },
            { text: "Premium workshops & webinars" }
          ]}
          buttonText="Get Started"
          buttonVariant="outline"
        />
      </TabsContent>
    </Tabs>
  );
};

export default TalentPlansTabs;
