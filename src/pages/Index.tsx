import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { HowItWorks } from '@/components/HowItWorks';
import { CompanySpotlight } from '@/components/CompanySpotlight';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <HowItWorks />
      <CompanySpotlight />
      <Footer />
    </div>
  );
};

export default Index;
