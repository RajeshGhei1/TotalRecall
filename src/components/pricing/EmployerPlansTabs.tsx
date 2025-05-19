
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PricingCard from './PricingCard';

interface EmployerPlansTabsProps {
  currency: 'USD' | 'INR';
  formatPrice: (usdPrice: number) => string;
}

const EmployerPlansTabs: React.FC<EmployerPlansTabsProps> = ({ currency, formatPrice }) => {
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
        {/* Basic Plan */}
        <PricingCard
          title="Basic"
          price={formatPrice(49)}
          description="For small businesses"
          iconType="tag"
          features={[
            { text: "Up to 3 active job postings" },
            { text: "Basic applicant tracking" },
            { text: "Standard job visibility" },
            { text: "Email support" },
            { text: "1 user account" }
          ]}
          buttonText="Get Started"
          buttonVariant="outline"
        />
        
        {/* Growth Plan */}
        <PricingCard
          title="Growth"
          price={formatPrice(129)}
          description="For growing businesses"
          iconType="crown"
          isPopular={true}
          features={[
            { text: "Up to 10 active job postings" },
            { text: "Advanced applicant tracking" },
            { text: "Featured job listings" },
            { text: "AI candidate matching" },
            { text: "Priority support" },
            { text: "3 user accounts" },
            { text: "Company profile page" }
          ]}
          buttonText="Get Started"
          buttonVariant="default"
        />
        
        {/* Business Plan */}
        <PricingCard
          title="Business"
          price={formatPrice(299)}
          description="For larger organizations"
          iconType="crownSecondary"
          features={[
            { text: "Up to 25 active job postings" },
            { text: "Premium applicant tracking" },
            { text: "Premium job visibility" },
            { text: "Advanced AI matching" },
            { text: "Dedicated support" },
            { text: "10 user accounts" },
            { text: "Branded career portal" },
            { text: "Basic API access" }
          ]}
          buttonText="Contact Sales"
          buttonVariant="outline"
        />
      </TabsContent>
      
      <TabsContent value="annual" className="space-y-8 mt-4 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-3 sm:gap-6">
        {/* Annual billing plans for employers */}
        <PricingCard
          title="Basic"
          price={formatPrice(39)}
          description="Billed annually"
          annualBilling={true}
          annualPrice={`(${currency === 'USD' ? '$468' : '₹' + Math.round(468 * inrConversionRate / 10) * 10}/year)`}
          iconType="tag"
          features={[
            { text: "Up to 3 active job postings" },
            { text: "Basic applicant tracking" },
            { text: "Standard job visibility" },
            { text: "Email support" },
            { text: "1 user account" }
          ]}
          buttonText="Get Started"
          buttonVariant="outline"
        />
        
        <PricingCard
          title="Growth"
          price={formatPrice(103)}
          description="Billed annually"
          annualBilling={true}
          annualPrice={`(${currency === 'USD' ? '$1,236' : '₹' + Math.round(1236 * inrConversionRate / 10) * 10}/year)`}
          iconType="crown"
          isPopular={true}
          features={[
            { text: "Up to 10 active job postings" },
            { text: "Advanced applicant tracking" },
            { text: "Featured job listings" },
            { text: "AI candidate matching" },
            { text: "Priority support" },
            { text: "3 user accounts" },
            { text: "Company profile page" }
          ]}
          buttonText="Get Started"
          buttonVariant="default"
        />
        
        <PricingCard
          title="Business"
          price={formatPrice(239)}
          description="Billed annually"
          annualBilling={true}
          annualPrice={`(${currency === 'USD' ? '$2,868' : '₹' + Math.round(2868 * inrConversionRate / 10) * 10}/year)`}
          iconType="crownSecondary"
          features={[
            { text: "Up to 25 active job postings" },
            { text: "Premium applicant tracking" },
            { text: "Premium job visibility" },
            { text: "Advanced AI matching" },
            { text: "Dedicated support" },
            { text: "10 user accounts" },
            { text: "Branded career portal" },
            { text: "Basic API access" }
          ]}
          buttonText="Contact Sales"
          buttonVariant="outline"
        />
      </TabsContent>
    </Tabs>
  );
};

export default EmployerPlansTabs;
