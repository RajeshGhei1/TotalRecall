
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CurrencySelector from '../components/pricing/CurrencySelector';
import UserTypeTabs from '../components/pricing/UserTypeTabs';
import FAQSection from '../components/pricing/FAQSection';
import { supabase } from '@/integrations/supabase/client';

const PricingPage = () => {
  const [currency, setCurrency] = useState<'USD' | 'INR'>('USD');
  
  // Currency conversion factor (approximate)
  const inrConversionRate = 83;
  
  // Format price based on currency
  const formatPrice = (usdPrice: number) => {
    if (currency === 'USD') {
      return `$${usdPrice}`;
    } else {
      const inrPrice = Math.round(usdPrice * inrConversionRate / 10) * 10; // Round to nearest 10 INR
      return `₹${inrPrice}`;
    }
  };

  // Set up real-time subscription to subscription plans changes
  useEffect(() => {
    const channel = supabase
      .channel('pricing-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscription_plans'
        },
        (payload) => {
          console.log('Subscription plans updated:', payload);
          // The useSubscriptionPlans hook will automatically refetch due to real-time updates
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'module_permissions'
        },
        (payload) => {
          console.log('Module permissions updated:', payload);
          // This will trigger re-renders of pricing calculations
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'module_pricing'
        },
        (payload) => {
          console.log('Module pricing updated:', payload);
          // This will trigger re-renders of pricing calculations
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="container mx-auto py-16 px-4 sm:px-6 md:py-24">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold heading-gradient mb-4">
              Pricing Plans for Every Need
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Choose the perfect plan for recruitment companies, employers, or talent
            </p>
            
            {/* Currency Selector */}
            <CurrencySelector currency={currency} setCurrency={setCurrency} />
          </div>
          
          {/* User Type Tabs with Dynamic Pricing */}
          <UserTypeTabs currency={currency} formatPrice={formatPrice} />
        </section>
        
        {/* FAQ Section */}
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;
