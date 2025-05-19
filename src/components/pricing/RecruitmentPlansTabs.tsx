
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PricingCard from './PricingCard';

interface RecruitmentPlansTabsProps {
  currency: 'USD' | 'INR';
  formatPrice: (usdPrice: number) => string;
}

const RecruitmentPlansTabs: React.FC<RecruitmentPlansTabsProps> = ({ currency, formatPrice }) => {
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
        {/* Starter Plan */}
        <PricingCard
          title="Starter"
          price={formatPrice(99)}
          description="For small recruitment teams"
          iconType="tag"
          features={[
            { text: "Up to 10 active job postings" },
            { text: "50 candidate profiles" },
            { text: "Basic ATS functionality" },
            { text: "Email support" },
            { text: "2 user accounts" }
          ]}
          buttonText="Get Started"
          buttonVariant="outline"
        />
        
        {/* Professional Plan */}
        <PricingCard
          title="Professional"
          price={formatPrice(299)}
          description="For growing recruitment agencies"
          iconType="crown"
          isPopular={true}
          features={[
            { text: "Up to 50 active job postings" },
            { text: "500 candidate profiles" },
            { text: "Advanced ATS & CRM" },
            { text: "AI candidate matching" },
            { text: "Priority support" },
            { text: "10 user accounts" },
            { text: "Custom branding" }
          ]}
          buttonText="Get Started"
          buttonVariant="default"
        />
        
        {/* Enterprise Plan */}
        <PricingCard
          title="Enterprise"
          price={formatPrice(799)}
          description="For large recruitment operations"
          iconType="crownSecondary"
          features={[
            { text: "Unlimited job postings" },
            { text: "Unlimited candidate profiles" },
            { text: "Enterprise-grade ATS & CRM" },
            { text: "Advanced AI & analytics" },
            { text: "24/7 premium support" },
            { text: "Unlimited user accounts" },
            { text: "Dedicated account manager" },
            { text: "API access & custom integrations" }
          ]}
          buttonText="Contact Sales"
          buttonVariant="outline"
        />
      </TabsContent>
      
      <TabsContent value="annual" className="space-y-8 mt-4 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-3 sm:gap-6">
        {/* Annual billing plans with 20% discount */}
        <PricingCard
          title="Starter"
          price={formatPrice(79)}
          description="Billed annually"
          annualBilling={true}
          annualPrice={`(${currency === 'USD' ? '$948' : '₹' + Math.round(948 * inrConversionRate / 10) * 10}/year)`}
          iconType="tag"
          features={[
            { text: "Up to 10 active job postings" },
            { text: "50 candidate profiles" },
            { text: "Basic ATS functionality" },
            { text: "Email support" },
            { text: "2 user accounts" }
          ]}
          buttonText="Get Started"
          buttonVariant="outline"
        />
        
        <PricingCard
          title="Professional"
          price={formatPrice(239)}
          description="Billed annually"
          annualBilling={true}
          annualPrice={`(${currency === 'USD' ? '$2,868' : '₹' + Math.round(2868 * inrConversionRate / 10) * 10}/year)`}
          iconType="crown"
          isPopular={true}
          features={[
            { text: "Up to 50 active job postings" },
            { text: "500 candidate profiles" },
            { text: "Advanced ATS & CRM" },
            { text: "AI candidate matching" },
            { text: "Priority support" },
            { text: "10 user accounts" },
            { text: "Custom branding" }
          ]}
          buttonText="Get Started"
          buttonVariant="default"
        />
        
        <PricingCard
          title="Enterprise"
          price={formatPrice(639)}
          description="Billed annually"
          annualBilling={true}
          annualPrice={`(${currency === 'USD' ? '$7,668' : '₹' + Math.round(7668 * inrConversionRate / 10) * 10}/year)`}
          iconType="crownSecondary"
          features={[
            { text: "Unlimited job postings" },
            { text: "Unlimited candidate profiles" },
            { text: "Enterprise-grade ATS & CRM" },
            { text: "Advanced AI & analytics" },
            { text: "24/7 premium support" },
            { text: "Unlimited user accounts" },
            { text: "Dedicated account manager" },
            { text: "API access & custom integrations" }
          ]}
          buttonText="Contact Sales"
          buttonVariant="outline"
        />
      </TabsContent>
    </Tabs>
  );
};

export default RecruitmentPlansTabs;
