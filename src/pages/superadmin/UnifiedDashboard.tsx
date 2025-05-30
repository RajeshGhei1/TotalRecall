
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
import { Building, Users, Briefcase, Users as UsersIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useCompanies } from '@/hooks/useCompanies';
import { useIsMobile } from '@/hooks/use-mobile';
import DynamicFormWidget from '@/components/forms/integration/DynamicFormWidget';
import DynamicDashboard from '@/components/dashboard/DynamicDashboard';
import AnalyticsDashboard from '@/components/reporting/AnalyticsDashboard';
import RevenueOverview from '@/components/superadmin/revenue/RevenueOverview';
import SubscriptionManagement from '@/components/superadmin/revenue/SubscriptionManagement';
import InvoiceList from '@/components/superadmin/revenue/InvoiceList';
import PaymentHistory from '@/components/superadmin/revenue/PaymentHistory';
import ReportBuilder from '@/components/reporting/ReportBuilder';
import DashboardBuilder from '@/components/dashboard/DashboardBuilder';

const UnifiedDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [revenueSubTab, setRevenueSubTab] = useState('analytics');
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

      const jobCount = 256; // Placeholder

      return {
        userCount: userCount || 0,
        tenantCount: tenantCount || 0,
        jobCount
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
              <BreadcrumbPage>Business Intelligence Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Business Intelligence Dashboard</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Comprehensive platform overview, analytics, and business intelligence
          </p>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 flex-wrap h-auto p-1">
            <TabsTrigger value="overview" className="whitespace-nowrap">Quick Overview</TabsTrigger>
            <TabsTrigger value="custom-dashboards" className="whitespace-nowrap">Custom Dashboards</TabsTrigger>
            <TabsTrigger value="analytics" className="whitespace-nowrap">Analytics & Reports</TabsTrigger>
            <TabsTrigger value="revenue" className="whitespace-nowrap">Revenue Intelligence</TabsTrigger>
            <TabsTrigger value="builder" className="whitespace-nowrap">Dashboard Builder</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="space-y-6">
              {/* Platform metrics cards */}
              <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                <Card className="xl:col-span-2 shadow-sm">
                  <CardHeader className="pb-2 px-4 pt-4 md:px-6 md:pt-6">
                    <CardTitle className="flex text-base md:text-lg items-center gap-2">
                      <UsersIcon className="h-4 w-4 text-muted-foreground" />
                      <span>Total Users</span>
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm">Platform user count</CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
                    {isLoading ? (
                      <Skeleton className="h-6 md:h-8 w-20" />
                    ) : (
                      <div className="text-2xl md:text-3xl font-bold">{platformMetrics?.userCount}</div>
                    )}
                  </CardContent>
                </Card>

                <Card className="xl:col-span-2 shadow-sm">
                  <CardHeader className="pb-2 px-4 pt-4 md:px-6 md:pt-6">
                    <CardTitle className="flex text-base md:text-lg items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>Active Tenants</span>
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm">Organizations using the platform</CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
                    {isLoading ? (
                      <Skeleton className="h-6 md:h-8 w-20" />
                    ) : (
                      <div className="text-2xl md:text-3xl font-bold">{platformMetrics?.tenantCount}</div>
                    )}
                  </CardContent>
                </Card>

                <Card className="xl:col-span-2 shadow-sm">
                  <CardHeader className="pb-2 px-4 pt-4 md:px-6 md:pt-6">
                    <CardTitle className="flex text-base md:text-lg items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span>Jobs Posted</span>
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm">In the last 30 days</CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
                    {isLoading ? (
                      <Skeleton className="h-6 md:h-8 w-20" />
                    ) : (
                      <div className="text-2xl md:text-3xl font-bold">{platformMetrics?.jobCount}</div>
                    )}
                  </CardContent>
                </Card>

                <Card className="xl:col-span-2 shadow-sm">
                  <CardHeader className="pb-2 px-4 pt-4 md:px-6 md:pt-6">
                    <CardTitle className="flex text-base md:text-lg items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>Companies</span>
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm">Registered companies</CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
                    {isLoading ? (
                      <Skeleton className="h-6 md:h-8 w-20" />
                    ) : (
                      <div className="text-2xl md:text-3xl font-bold">{companies?.length || 0}</div>
                    )}
                  </CardContent>
                </Card>

                <Card className="xl:col-span-2 shadow-sm">
                  <CardHeader className="pb-2 px-4 pt-4 md:px-6 md:pt-6">
                    <CardTitle className="flex text-base md:text-lg items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>Talent</span>
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm">Candidate pool</CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
                    {isLoading ? (
                      <Skeleton className="h-6 md:h-8 w-20" />
                    ) : (
                      <div className="text-2xl md:text-3xl font-bold">{peopleData?.talentCount || 0}</div>
                    )}
                  </CardContent>
                </Card>

                <Card className="xl:col-span-2 shadow-sm">
                  <CardHeader className="pb-2 px-4 pt-4 md:px-6 md:pt-6">
                    <CardTitle className="flex text-base md:text-lg items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>Business Contacts</span>
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm">Professional network</CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
                    {isLoading ? (
                      <Skeleton className="h-6 md:h-8 w-20" />
                    ) : (
                      <div className="text-2xl md:text-3xl font-bold">{peopleData?.contactCount || 0}</div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Additional info cards */}
              <div className="mt-6 md:mt-8 grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                <Card className="shadow-sm">
                  <CardHeader className="px-4 pt-4 pb-2 md:px-6 md:pt-6">
                    <CardTitle className="text-base md:text-lg">Recent Activity</CardTitle>
                    <CardDescription className="text-xs md:text-sm">Latest platform events</CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
                    <p className="text-sm text-muted-foreground">Activity data will be displayed here.</p>
                  </CardContent>
                </Card>
                
                <Card className="shadow-sm">
                  <CardHeader className="px-4 pt-4 pb-2 md:px-6 md:pt-6">
                    <CardTitle className="text-base md:text-lg">System Status</CardTitle>
                    <CardDescription className="text-xs md:text-sm">Platform health metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
                    <p className="text-sm text-muted-foreground">System status information will be displayed here.</p>
                  </CardContent>
                </Card>

                <div className="xl:col-span-1">
                  <DynamicFormWidget 
                    context={{ page: 'dashboard', userType: 'super_admin' }}
                    maxForms={3}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="custom-dashboards">
            <DynamicDashboard />
          </TabsContent>
          
          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>
          
          <TabsContent value="revenue">
            <div className="space-y-6">
              <Tabs defaultValue={revenueSubTab} onValueChange={setRevenueSubTab} className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="analytics">Revenue Analytics</TabsTrigger>
                  <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
                  <TabsTrigger value="invoices">Invoices</TabsTrigger>
                  <TabsTrigger value="payments">Payment History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="analytics">
                  <RevenueOverview />
                </TabsContent>
                
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
            </div>
          </TabsContent>
          
          <TabsContent value="builder">
            <div className="space-y-6">
              <DashboardBuilder />
              <ReportBuilder />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default UnifiedDashboard;
