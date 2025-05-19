
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Crown, Tag } from 'lucide-react';

const PricingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="container mx-auto py-16 px-4 sm:px-6 md:py-24">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold heading-gradient mb-4">
              Pricing Plans for Every Need
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose the perfect plan for your recruitment needs with our flexible pricing options.
            </p>
          </div>
          
          <Tabs defaultValue="monthly" className="w-full max-w-4xl mx-auto">
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
                    <span className="text-4xl font-bold">$49</span>
                    <span className="text-muted-foreground ml-2">/month</span>
                  </div>
                  <CardDescription className="mt-2">For small teams getting started with recruitment</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                      <span>Up to 5 active job postings</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                      <span>Basic candidate tracking</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                      <span>Email support</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                      <span>Basic AI recommendations</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                      <span>1 admin user</span>
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
                    <span className="text-4xl font-bold">$99</span>
                    <span className="text-muted-foreground ml-2">/month</span>
                  </div>
                  <CardDescription className="mt-2">For growing teams with advanced recruitment needs</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                      <span>Up to 20 active job postings</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                      <span>Advanced candidate tracking</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                      <span>Priority email & chat support</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                      <span>Full AI candidate matching</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                      <span>5 admin users</span>
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
                    <span className="text-4xl font-bold">$249</span>
                    <span className="text-muted-foreground ml-2">/month</span>
                  </div>
                  <CardDescription className="mt-2">For large organizations with custom requirements</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                      <span>Unlimited job postings</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                      <span>Enterprise-grade ATS</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                      <span>24/7 priority support</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                      <span>Advanced AI & analytics</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                      <span>Unlimited admin users</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                      <span>API access</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                      <span>Custom integrations</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="lg" className="w-full">Contact Sales</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="annual" className="space-y-8 mt-4 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-3 sm:gap-6">
              {/* Starter Plan - Annual */}
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl font-bold">
                    <Tag className="mr-2 h-5 w-5 text-primary" />
                    Starter
                  </CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">$39</span>
                    <span className="text-muted-foreground ml-2">/month</span>
                  </div>
                  <CardDescription className="mt-2">
                    <span className="text-sm">Billed annually ($468/year)</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                      <span>Up to 5 active job postings</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                      <span>Basic candidate tracking</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                      <span>Email support</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                      <span>Basic AI recommendations</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                      <span>1 admin user</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="lg" className="w-full">Get Started</Button>
                </CardFooter>
              </Card>
              
              {/* Professional Plan - Annual */}
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
                    <span className="text-4xl font-bold">$79</span>
                    <span className="text-muted-foreground ml-2">/month</span>
                  </div>
                  <CardDescription className="mt-2">
                    <span className="text-sm">Billed annually ($948/year)</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                      <span>Up to 20 active job postings</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                      <span>Advanced candidate tracking</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                      <span>Priority email & chat support</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                      <span>Full AI candidate matching</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                      <span>5 admin users</span>
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
              
              {/* Enterprise Plan - Annual */}
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl font-bold">
                    <Crown className="mr-2 h-5 w-5 text-secondary" />
                    Enterprise
                  </CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">$199</span>
                    <span className="text-muted-foreground ml-2">/month</span>
                  </div>
                  <CardDescription className="mt-2">
                    <span className="text-sm">Billed annually ($2,388/year)</span>
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
                      <span>Enterprise-grade ATS</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                      <span>24/7 priority support</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                      <span>Advanced AI & analytics</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                      <span>Unlimited admin users</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                      <span>API access</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary mt-0.5" />
                      <span>Custom integrations</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="lg" className="w-full">Contact Sales</Button>
                </CardFooter>
              </Card>
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
                <p>All plans come with a 14-day free trial. You can explore all features without any commitment. No credit card required to start your trial.</p>
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
                <p>We accept all major credit cards including Visa, Mastercard, American Express, and Discover. For Enterprise plans, we also offer invoicing options.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Is there a setup fee?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>No, there are no setup fees for any of our plans. You only pay the advertised monthly or annual subscription price.</p>
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
