
import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Building, Users, Users as UsersIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useCompanies } from '@/hooks/useCompanies';
import { useIsMobile } from '@/hooks/use-mobile';
import DynamicFormWidget from '@/components/forms/integration/DynamicFormWidget';
import { FormProvider } from '@/contexts/FormContext';
import DynamicDashboard from '@/components/dashboard/DynamicDashboard';
import AnalyticsDashboard from '@/components/reporting/AnalyticsDashboard';
import RevenueOverview from '@/components/superadmin/revenue/RevenueOverview';
import SubscriptionManagement from '@/components/superadmin/revenue/SubscriptionManagement';
import InvoiceList from '@/components/superadmin/revenue/InvoiceList';
import PaymentHistory from '@/components/superadmin/revenue/PaymentHistory';
import ReportBuilder from '@/components/reporting/ReportBuilder';
import DashboardBuilder from '@/components/dashboard/DashboardBuilder';
import { PredictiveInsightsDashboard } from '@/components/superadmin/ai/insights';

const AnalyticsBusinessIntelligence = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const isMobile = useIsMobile();
  
  // Fetch companies data
  const { companies, isLoading: isLoadingCompanies } = useCompanies();

  // Fetch people data
  const { data: peopleData, isLoading: isLoadingPeople } = useQuery({
    queryKey: ['dashboard-people-count'],
    queryFn: async () => {
      const { count: totalPeople, error: peopleError } = await supabase
        .from('people')
        .select('*', { count: 'exact', head: true });

      if (peopleError) throw peopleError;

      const { count: talentCount, error: talentError } = await supabase
        .from('talents')
        .select('*', { count: 'exact', head: true });

      if (talentError) throw talentError;

      return {
        totalPeople: totalPeople || 0,
        talentCount: talentCount || 0,
        contactCount: (totalPeople || 0) - (talentCount || 0)
      };
    }
  });

  // Fetch basic platform metrics
  const { data: platformMetrics, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      const { count: userCount, error: userError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (userError) throw userError;

      const { count: tenantCount, error: tenantError } = await supabase
        .from('tenants')
        .select('*', { count: 'exact', head: true });

      if (tenantError) throw tenantError;

      return {
        userCount: userCount || 0,
        tenantCount: tenantCount || 0
      };
    }
  });

  const isLoading = isLoadingCompanies || isLoadingPeople || isLoadingMetrics;

  return (
    <AdminLayout>
      <div className="p-3 sm:p-6">
        <Breadcrumb className="mb-4 md:mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/superadmin/dashboard">Superadmin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>BI Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Business Intelligence Dashboard</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Overview of TotalRecall.ai Platform with comprehensive analytics, predictive insights, and business intelligence
          </p>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 flex-wrap h-auto p-1">
            <TabsTrigger value="dashboard" className="whitespace-nowrap">Dashboard Overview</TabsTrigger>
            <TabsTrigger value="predictive" className="whitespace-nowrap">Predictive Insights</TabsTrigger>
            <TabsTrigger value="operational" className="whitespace-nowrap">Operational Analytics</TabsTrigger>
            <TabsTrigger value="revenue-analytics" className="whitespace-nowrap">Revenue Analytics</TabsTrigger>
            <TabsTrigger value="revenue-management" className="whitespace-nowrap">Revenue Management</TabsTrigger>
            <TabsTrigger value="reports" className="whitespace-nowrap">Report Builder</TabsTrigger>
            <TabsTrigger value="builder" className="whitespace-nowrap">Dashboard Builder</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <div className="space-y-4 md:space-y-6">
              {/* Dashboard cards - enhanced responsive grid */}
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr">
                {/* Users Card - responsive column span */}
                <Card className="sm:col-span-1 lg:col-span-1 xl:col-span-1 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2 px-3 sm:px-4 pt-3 sm:pt-4 md:px-6 md:pt-6">
                    <CardTitle className="flex text-sm sm:text-base md:text-lg items-center gap-2">
                      <UsersIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">Total Users</span>
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm">Platform user count</CardDescription>
                  </CardHeader>
                  <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4 md:px-6 md:pb-6">
                    {isLoading ? (
                      <Skeleton className="h-6 sm:h-7 md:h-8 w-16 sm:w-20" />
                    ) : (
                      <div className="text-xl sm:text-2xl md:text-3xl font-bold">{platformMetrics?.userCount}</div>
                    )}
                  </CardContent>
                </Card>

                {/* Tenants Card */}
                <Card className="sm:col-span-1 lg:col-span-1 xl:col-span-1 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2 px-3 sm:px-4 pt-3 sm:pt-4 md:px-6 md:pt-6">
                    <CardTitle className="flex text-sm sm:text-base md:text-lg items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">Active Tenants</span>
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm">Organizations using the platform</CardDescription>
                  </CardHeader>
                  <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4 md:px-6 md:pb-6">
                    {isLoading ? (
                      <Skeleton className="h-6 sm:h-7 md:h-8 w-16 sm:w-20" />
                    ) : (
                      <div className="text-xl sm:text-2xl md:text-3xl font-bold">{platformMetrics?.tenantCount}</div>
                    )}
                  </CardContent>
                </Card>

                {/* Companies Card */}
                <Card className="sm:col-span-1 lg:col-span-1 xl:col-span-1 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2 px-3 sm:px-4 pt-3 sm:pt-4 md:px-6 md:pt-6">
                    <CardTitle className="flex text-sm sm:text-base md:text-lg items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">Companies</span>
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm">Registered companies</CardDescription>
                  </CardHeader>
                  <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4 md:px-6 md:pb-6">
                    {isLoading ? (
                      <Skeleton className="h-6 sm:h-7 md:h-8 w-16 sm:w-20" />
                    ) : (
                      <div className="text-xl sm:text-2xl md:text-3xl font-bold">{companies?.length || 0}</div>
                    )}
                  </CardContent>
                </Card>

                {/* Contacts Card */}
                <Card className="sm:col-span-1 lg:col-span-1 xl:col-span-1 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2 px-3 sm:px-4 pt-3 sm:pt-4 md:px-6 md:pt-6">
                    <CardTitle className="flex text-sm sm:text-base md:text-lg items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">Business Contacts</span>
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm">Professional network</CardDescription>
                  </CardHeader>
                  <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4 md:px-6 md:pb-6">
                    {isLoading ? (
                      <Skeleton className="h-6 sm:h-7 md:h-8 w-16 sm:w-20" />
                    ) : (
                      <div className="text-xl sm:text-2xl md:text-3xl font-bold">{peopleData?.contactCount || 0}</div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Additional responsive cards */}
              <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="px-3 sm:px-4 pt-3 sm:pt-4 pb-2 md:px-6 md:pt-6">
                    <CardTitle className="text-sm sm:text-base md:text-lg">Recent Activity</CardTitle>
                    <CardDescription className="text-xs md:text-sm">Latest platform events</CardDescription>
                  </CardHeader>
                  <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4 md:px-6 md:pb-6">
                    <p className="text-sm text-muted-foreground">Activity data will be displayed here.</p>
                  </CardContent>
                </Card>
                
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="px-3 sm:px-4 pt-3 sm:pt-4 pb-2 md:px-6 md:pt-6">
                    <CardTitle className="text-sm sm:text-base md:text-lg">System Status</CardTitle>
                    <CardDescription className="text-xs md:text-sm">Platform health metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4 md:px-6 md:pb-6">
                    <p className="text-sm text-muted-foreground">System status information will be displayed here.</p>
                  </CardContent>
                </Card>

                {/* Dynamic Form Widget - responsive */}
                <div className="md:col-span-2 xl:col-span-1">
                  <FormProvider>
                    <DynamicFormWidget 
                      context={{ page: 'dashboard', userType: 'super_admin' }}
                      maxForms={3}
                    />
                  </FormProvider>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="predictive">
            <PredictiveInsightsDashboard />
          </TabsContent>
          
          <TabsContent value="operational">
            <AnalyticsDashboard />
          </TabsContent>
          
          <TabsContent value="revenue-analytics">
            <div className="space-y-6">
              <RevenueOverview />
            </div>
          </TabsContent>
          
          <TabsContent value="revenue-management">
            <Tabs defaultValue="subscriptions" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
                <TabsTrigger value="invoices">Invoices</TabsTrigger>
                <TabsTrigger value="payments">Payment History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="subscriptions">
                <SubscriptionManagement />
              </TabsContent>
              
              <TabsContent value="invoices">
                <InvoiceList />
              </TabsContent>
              
              <TabsContent value="payments">
                <PaymentHistory />
              </TabsContent>
            </Tabs>
          </TabsContent>
          
          <TabsContent value="reports">
            <ReportBuilder />
          </TabsContent>
          
          <TabsContent value="builder">
            <DashboardBuilder />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AnalyticsBusinessIntelligence;
