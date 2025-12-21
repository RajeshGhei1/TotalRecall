import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import AppsShowcase from '@/components/AppsShowcase';
import FeaturesShowcase from '@/components/FeaturesShowcase';
import IndustriesShowcase from '@/components/IndustriesShowcase';
import { HowItWorks } from '@/components/HowItWorks';
import { CompanySpotlight } from '@/components/CompanySpotlight';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <div id="apps">
        <AppsShowcase />
      </div>
      <div id="features">
        <FeaturesShowcase />
      </div>
      <div id="industries">
        <IndustriesShowcase />
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
