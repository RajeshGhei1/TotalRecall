
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { HowItWorks } from '@/components/HowItWorks';
import { CompanySpotlight } from '@/components/CompanySpotlight';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <Hero />
      <HowItWorks />
      <CompanySpotlight />
      <Footer />
    </div>
  );
};

export default Index;
