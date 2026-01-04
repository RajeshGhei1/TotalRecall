import React, { Suspense, lazy } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { HowItWorks } from '@/components/HowItWorks';
import { CompanySpotlight } from '@/components/CompanySpotlight';
import { Footer } from '@/components/Footer';

// Lazy load large showcase components for better code splitting
const AppsShowcase = lazy(() => import('@/components/AppsShowcase'));
const FeaturesShowcase = lazy(() => import('@/components/FeaturesShowcase'));
const IndustriesShowcase = lazy(() => import('@/components/IndustriesShowcase'));

// Loading component for showcase sections
const ShowcaseLoader = () => (
  <div className="bg-white py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  </div>
);

const Index = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <div id="apps">
        <Suspense fallback={<ShowcaseLoader />}>
          <AppsShowcase />
        </Suspense>
      </div>
      <div id="features">
        <Suspense fallback={<ShowcaseLoader />}>
          <FeaturesShowcase />
        </Suspense>
      </div>
      <div id="industries">
        <Suspense fallback={<ShowcaseLoader />}>
          <IndustriesShowcase />
        </Suspense>
      </div>
      <HowItWorks />
      <CompanySpotlight />
      <div id="help">
        <Footer />
      </div>
    </div>
  );
};

export default Index;
