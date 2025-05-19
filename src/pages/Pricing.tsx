
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Crown, Tag, BadgeDollarSign, BadgeIndianRupee, Building, User, Briefcase } from 'lucide-react';

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
            <div className="flex items-center justify-center mb-8">
              <span className="text-sm font-medium mr-3">Currency:</span>
              <div className="bg-muted rounded-lg p-1 inline-flex">
                <button 
                  onClick={() => setCurrency('USD')}
                  className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
                    currency === 'USD' 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'text-muted-foreground hover:bg-muted-foreground/10'
                  }`}
                >
                  <BadgeDollarSign className="h-3.5 w-3.5 mr-1" />
                  USD
                </button>
                <button 
                  onClick={() => setCurrency('INR')}
                  className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
                    currency === 'INR' 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'text-muted-foreground hover:bg-muted-foreground/10'
                  }`}
                >
                  <BadgeIndianRupee className="h-3.5 w-3.5 mr-1" />
                  INR
                </button>
              </div>
            </div>
          </div>
          
          {/* User Type Tabs */}
          <Tabs defaultValue="recruitment" className="w-full max-w-5xl mx-auto">
            <div className="flex justify-center mb-10">
              <TabsList className="grid grid-cols-3 h-auto p-1">
                <TabsTrigger value="recruitment" className="flex items-center gap-2 py-3 px-4">
                  <Building className="h-4 w-4" />
                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium">Recruitment Companies</span>
                    <span className="text-xs text-muted-foreground hidden sm:inline-block">Full recruitment platform</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="employers" className="flex items-center gap-2 py-3 px-4">
                  <Briefcase className="h-4 w-4" />
                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium">Employers</span>
                    <span className="text-xs text-muted-foreground hidden sm:inline-block">Job posting only</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="talent" className="flex items-center gap-2 py-3 px-4">
                  <User className="h-4 w-4" />
                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium">Talent</span>
                    <span className="text-xs text-muted-foreground hidden sm:inline-block">For job seekers</span>
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>
            
            {/* Recruitment Companies Plans */}
            <TabsContent value="recruitment" className="space-y-8">
              <Tabs defaultValue="monthly" className="w-full">
                <div className="flex justify-center mb-8">
                  <TabsList>
                    <TabsTrigger value="monthly">Monthly Billing</TabsTrigger>
                    <TabsTrigger value="annual">Annual Billing <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Save 20%</span></TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="monthly" className="space-y-8 mt-4 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-3 sm:gap-6">
                  {/* Starter Plan */}
                  <Card className="card-hover">
                    <CardHeader>
                      <CardTitle className="flex items-center text-2xl font-bold">
                        <Tag className="mr-2 h-5 w-5 text-primary" />
                        Starter
                      </CardTitle>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">{formatPrice(99)}</span>
                        <span className="text-muted-foreground ml-2">/month</span>
                      </div>
                      <CardDescription className="mt-2">For small recruitment teams</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Up to 10 active job postings</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>50 candidate profiles</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Basic ATS functionality</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Email support</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>2 user accounts</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="lg" className="w-full">Get Started</Button>
                    </CardFooter>
                  </Card>
                  
                  {/* Professional Plan */}
                  <Card className="card-gradient relative overflow-hidden card-hover border-primary/50 shadow-lg">
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
                      MOST POPULAR
                    </div>
                    <CardHeader>
                      <CardTitle className="flex items-center text-2xl font-bold">
                        <Crown className="mr-2 h-5 w-5 text-primary" />
                        Professional
                      </CardTitle>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">{formatPrice(299)}</span>
                        <span className="text-muted-foreground ml-2">/month</span>
                      </div>
                      <CardDescription className="mt-2">For growing recruitment agencies</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Up to 50 active job postings</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>500 candidate profiles</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Advanced ATS & CRM</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>AI candidate matching</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Priority support</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>10 user accounts</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Custom branding</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button size="lg" className="w-full">Get Started</Button>
                    </CardFooter>
                  </Card>
                  
                  {/* Enterprise Plan */}
                  <Card className="card-hover">
                    <CardHeader>
                      <CardTitle className="flex items-center text-2xl font-bold">
                        <Crown className="mr-2 h-5 w-5 text-secondary" />
                        Enterprise
                      </CardTitle>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">{formatPrice(799)}</span>
                        <span className="text-muted-foreground ml-2">/month</span>
                      </div>
                      <CardDescription className="mt-2">For large recruitment operations</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Unlimited job postings</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Unlimited candidate profiles</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Enterprise-grade ATS & CRM</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Advanced AI & analytics</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>24/7 premium support</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Unlimited user accounts</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Dedicated account manager</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>API access & custom integrations</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="lg" className="w-full">Contact Sales</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="annual" className="space-y-8 mt-4 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-3 sm:gap-6">
                  {/* Annual billing plans with 20% discount */}
                  <Card className="card-hover">
                    <CardHeader>
                      <CardTitle className="flex items-center text-2xl font-bold">
                        <Tag className="mr-2 h-5 w-5 text-primary" />
                        Starter
                      </CardTitle>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">{formatPrice(79)}</span>
                        <span className="text-muted-foreground ml-2">/month</span>
                      </div>
                      <CardDescription className="mt-2">
                        <span className="text-sm">Billed annually ({currency === 'USD' ? '$948' : '₹' + Math.round(948 * inrConversionRate / 10) * 10}/year)</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Up to 10 active job postings</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>50 candidate profiles</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Basic ATS functionality</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Email support</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>2 user accounts</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="lg" className="w-full">Get Started</Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="card-gradient relative overflow-hidden card-hover border-primary/50 shadow-lg">
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
                      MOST POPULAR
                    </div>
                    <CardHeader>
                      <CardTitle className="flex items-center text-2xl font-bold">
                        <Crown className="mr-2 h-5 w-5 text-primary" />
                        Professional
                      </CardTitle>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">{formatPrice(239)}</span>
                        <span className="text-muted-foreground ml-2">/month</span>
                      </div>
                      <CardDescription className="mt-2">
                        <span className="text-sm">Billed annually ({currency === 'USD' ? '$2,868' : '₹' + Math.round(2868 * inrConversionRate / 10) * 10}/year)</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Up to 50 active job postings</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>500 candidate profiles</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Advanced ATS & CRM</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>AI candidate matching</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Priority support</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>10 user accounts</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Custom branding</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button size="lg" className="w-full">Get Started</Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="card-hover">
                    <CardHeader>
                      <CardTitle className="flex items-center text-2xl font-bold">
                        <Crown className="mr-2 h-5 w-5 text-secondary" />
                        Enterprise
                      </CardTitle>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">{formatPrice(639)}</span>
                        <span className="text-muted-foreground ml-2">/month</span>
                      </div>
                      <CardDescription className="mt-2">
                        <span className="text-sm">Billed annually ({currency === 'USD' ? '$7,668' : '₹' + Math.round(7668 * inrConversionRate / 10) * 10}/year)</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Unlimited job postings</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Unlimited candidate profiles</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Enterprise-grade ATS & CRM</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Advanced AI & analytics</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>24/7 premium support</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Unlimited user accounts</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Dedicated account manager</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>API access & custom integrations</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="lg" className="w-full">Contact Sales</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </TabsContent>
            
            {/* Employers Plans */}
            <TabsContent value="employers" className="space-y-8">
              <Tabs defaultValue="monthly" className="w-full">
                <div className="flex justify-center mb-8">
                  <TabsList>
                    <TabsTrigger value="monthly">Monthly Billing</TabsTrigger>
                    <TabsTrigger value="annual">Annual Billing <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Save 20%</span></TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="monthly" className="space-y-8 mt-4 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-3 sm:gap-6">
                  {/* Basic Plan */}
                  <Card className="card-hover">
                    <CardHeader>
                      <CardTitle className="flex items-center text-2xl font-bold">
                        <Tag className="mr-2 h-5 w-5 text-primary" />
                        Basic
                      </CardTitle>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">{formatPrice(49)}</span>
                        <span className="text-muted-foreground ml-2">/month</span>
                      </div>
                      <CardDescription className="mt-2">For small businesses</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Up to 3 active job postings</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Basic applicant tracking</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Standard job visibility</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Email support</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>1 user account</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="lg" className="w-full">Get Started</Button>
                    </CardFooter>
                  </Card>
                  
                  {/* Growth Plan */}
                  <Card className="card-gradient relative overflow-hidden card-hover border-primary/50 shadow-lg">
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
                      MOST POPULAR
                    </div>
                    <CardHeader>
                      <CardTitle className="flex items-center text-2xl font-bold">
                        <Crown className="mr-2 h-5 w-5 text-primary" />
                        Growth
                      </CardTitle>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">{formatPrice(129)}</span>
                        <span className="text-muted-foreground ml-2">/month</span>
                      </div>
                      <CardDescription className="mt-2">For growing businesses</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Up to 10 active job postings</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Advanced applicant tracking</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Featured job listings</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>AI candidate matching</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Priority support</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>3 user accounts</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Company profile page</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button size="lg" className="w-full">Get Started</Button>
                    </CardFooter>
                  </Card>
                  
                  {/* Business Plan */}
                  <Card className="card-hover">
                    <CardHeader>
                      <CardTitle className="flex items-center text-2xl font-bold">
                        <Crown className="mr-2 h-5 w-5 text-secondary" />
                        Business
                      </CardTitle>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">{formatPrice(299)}</span>
                        <span className="text-muted-foreground ml-2">/month</span>
                      </div>
                      <CardDescription className="mt-2">For larger organizations</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Up to 25 active job postings</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Premium applicant tracking</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Premium job visibility</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Advanced AI matching</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Dedicated support</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>10 user accounts</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Branded career portal</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Basic API access</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="lg" className="w-full">Contact Sales</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="annual" className="space-y-8 mt-4 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-3 sm:gap-6">
                  {/* Annual billing plans for employers */}
                  <Card className="card-hover">
                    <CardHeader>
                      <CardTitle className="flex items-center text-2xl font-bold">
                        <Tag className="mr-2 h-5 w-5 text-primary" />
                        Basic
                      </CardTitle>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">{formatPrice(39)}</span>
                        <span className="text-muted-foreground ml-2">/month</span>
                      </div>
                      <CardDescription className="mt-2">
                        <span className="text-sm">Billed annually ({currency === 'USD' ? '$468' : '₹' + Math.round(468 * inrConversionRate / 10) * 10}/year)</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Up to 3 active job postings</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Basic applicant tracking</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Standard job visibility</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Email support</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>1 user account</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="lg" className="w-full">Get Started</Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="card-gradient relative overflow-hidden card-hover border-primary/50 shadow-lg">
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
                      MOST POPULAR
                    </div>
                    <CardHeader>
                      <CardTitle className="flex items-center text-2xl font-bold">
                        <Crown className="mr-2 h-5 w-5 text-primary" />
                        Growth
                      </CardTitle>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">{formatPrice(103)}</span>
                        <span className="text-muted-foreground ml-2">/month</span>
                      </div>
                      <CardDescription className="mt-2">
                        <span className="text-sm">Billed annually ({currency === 'USD' ? '$1,236' : '₹' + Math.round(1236 * inrConversionRate / 10) * 10}/year)</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Up to 10 active job postings</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Advanced applicant tracking</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Featured job listings</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>AI candidate matching</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Priority support</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>3 user accounts</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Company profile page</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button size="lg" className="w-full">Get Started</Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="card-hover">
                    <CardHeader>
                      <CardTitle className="flex items-center text-2xl font-bold">
                        <Crown className="mr-2 h-5 w-5 text-secondary" />
                        Business
                      </CardTitle>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">{formatPrice(239)}</span>
                        <span className="text-muted-foreground ml-2">/month</span>
                      </div>
                      <CardDescription className="mt-2">
                        <span className="text-sm">Billed annually ({currency === 'USD' ? '$2,868' : '₹' + Math.round(2868 * inrConversionRate / 10) * 10}/year)</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Up to 25 active job postings</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Premium applicant tracking</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Premium job visibility</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Advanced AI matching</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Dedicated support</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>10 user accounts</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Branded career portal</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Basic API access</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="lg" className="w-full">Contact Sales</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </TabsContent>
            
            {/* Talent Plans */}
            <TabsContent value="talent" className="space-y-8">
              <Tabs defaultValue="monthly" className="w-full">
                <div className="flex justify-center mb-8">
                  <TabsList>
                    <TabsTrigger value="monthly">Monthly Billing</TabsTrigger>
                    <TabsTrigger value="annual">Annual Billing <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Save 20%</span></TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="monthly" className="space-y-8 mt-4 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-3 sm:gap-6">
                  {/* Free Plan */}
                  <Card className="card-hover">
                    <CardHeader>
                      <CardTitle className="flex items-center text-2xl font-bold">
                        <Tag className="mr-2 h-5 w-5 text-primary" />
                        Free
                      </CardTitle>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">Free</span>
                      </div>
                      <CardDescription className="mt-2">Basic job search</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Basic profile creation</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Job search & alerts</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Apply to jobs</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Limited application tracking</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Basic community access</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="lg" className="w-full">Get Started</Button>
                    </CardFooter>
                  </Card>
                  
                  {/* Plus Plan */}
                  <Card className="card-gradient relative overflow-hidden card-hover border-primary/50 shadow-lg">
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
                      MOST POPULAR
                    </div>
                    <CardHeader>
                      <CardTitle className="flex items-center text-2xl font-bold">
                        <Crown className="mr-2 h-5 w-5 text-primary" />
                        Plus
                      </CardTitle>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">{formatPrice(9.99)}</span>
                        <span className="text-muted-foreground ml-2">/month</span>
                      </div>
                      <CardDescription className="mt-2">Enhanced job search & visibility</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Everything in Free plan</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Enhanced profile visibility</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>AI resume optimization</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Priority application status</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>See who viewed your profile</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Direct message to recruiters (5/month)</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Full community access</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button size="lg" className="w-full">Get Started</Button>
                    </CardFooter>
                  </Card>
                  
                  {/* Pro Plan */}
                  <Card className="card-hover">
                    <CardHeader>
                      <CardTitle className="flex items-center text-2xl font-bold">
                        <Crown className="mr-2 h-5 w-5 text-secondary" />
                        Pro
                      </CardTitle>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">{formatPrice(29.99)}</span>
                        <span className="text-muted-foreground ml-2">/month</span>
                      </div>
                      <CardDescription className="mt-2">Career acceleration & networking</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Everything in Plus plan</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Featured candidate status</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Unlimited direct messages</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>1:1 career coaching session (monthly)</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Advanced salary insights</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>AI interview preparation</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Early access to exclusive jobs</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Premium workshops & webinars</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="lg" className="w-full">Get Started</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="annual" className="space-y-8 mt-4 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-3 sm:gap-6">
                  {/* Annual billing plans for talent */}
                  <Card className="card-hover">
                    <CardHeader>
                      <CardTitle className="flex items-center text-2xl font-bold">
                        <Tag className="mr-2 h-5 w-5 text-primary" />
                        Free
                      </CardTitle>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">Free</span>
                      </div>
                      <CardDescription className="mt-2">Basic job search</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Basic profile creation</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Job search & alerts</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Apply to jobs</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Limited application tracking</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Basic community access</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="lg" className="w-full">Get Started</Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="card-gradient relative overflow-hidden card-hover border-primary/50 shadow-lg">
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
                      MOST POPULAR
                    </div>
                    <CardHeader>
                      <CardTitle className="flex items-center text-2xl font-bold">
                        <Crown className="mr-2 h-5 w-5 text-primary" />
                        Plus
                      </CardTitle>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">{formatPrice(7.99)}</span>
                        <span className="text-muted-foreground ml-2">/month</span>
                      </div>
                      <CardDescription className="mt-2">
                        <span className="text-sm">Billed annually ({currency === 'USD' ? '$95.88' : '₹' + Math.round(95.88 * inrConversionRate / 10) * 10}/year)</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Everything in Free plan</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Enhanced profile visibility</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>AI resume optimization</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Priority application status</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>See who viewed your profile</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Direct message to recruiters (5/month)</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Full community access</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button size="lg" className="w-full">Get Started</Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="card-hover">
                    <CardHeader>
                      <CardTitle className="flex items-center text-2xl font-bold">
                        <Crown className="mr-2 h-5 w-5 text-secondary" />
                        Pro
                      </CardTitle>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">{formatPrice(23.99)}</span>
                        <span className="text-muted-foreground ml-2">/month</span>
                      </div>
                      <CardDescription className="mt-2">
                        <span className="text-sm">Billed annually ({currency === 'USD' ? '$287.88' : '₹' + Math.round(287.88 * inrConversionRate / 10) * 10}/year)</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Everything in Plus plan</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Featured candidate status</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Unlimited direct messages</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>1:1 career coaching session (monthly)</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Advanced salary insights</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>AI interview preparation</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Early access to exclusive jobs</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                          <span>Premium workshops & webinars</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="lg" className="w-full">Get Started</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </section>
        
        {/* FAQ Section */}
        <section className="container mx-auto py-16 px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Have questions about our pricing? We've got answers.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>How does the free trial work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>All paid plans come with a 14-day free trial. You can explore all features without any commitment. No credit card required to start your trial.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Can I change my plan later?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Yes, you can upgrade or downgrade your plan at any time. When you upgrade, you'll be prorated for the remainder of your billing cycle. When you downgrade, changes take effect at the end of your current billing cycle.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>We accept all major credit cards including Visa, Mastercard, American Express, and Discover. For Enterprise plans, we also offer invoicing options. For India, we support UPI and net banking.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Are there any hidden fees?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>No, there are no hidden fees or setup costs. You only pay the advertised monthly or annual subscription price. All prices are inclusive of applicable taxes.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Do you offer discounts for startups or non-profits?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Yes, we offer special pricing for eligible startups and non-profit organizations. Please contact our sales team to learn more about our discount programs.</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;
