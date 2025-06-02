
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
import DynamicDashboard from '@/components/dashboard/DynamicDashboard';
import AnalyticsDashboard from '@/components/reporting/AnalyticsDashboard';
import RevenueOverview from '@/components/superadmin/revenue/RevenueOverview';
import SubscriptionManagement from '@/components/superadmin/revenue/SubscriptionManagement';
import InvoiceList from '@/components/superadmin/revenue/InvoiceList';
import PaymentHistory from '@/components/superadmin/revenue/PaymentHistory';
import ReportBuilder from '@/components/reporting/ReportBuilder';
import DashboardBuilder from '@/components/dashboard/DashboardBuilder';

const AnalyticsBusinessIntelligence = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

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
            Comprehensive analytics, revenue management, and business intelligence
          </p>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 flex-wrap h-auto p-1">
            <TabsTrigger value="dashboard" className="whitespace-nowrap">Dashboard Overview</TabsTrigger>
            <TabsTrigger value="operational" className="whitespace-nowrap">Operational Analytics</TabsTrigger>
            <TabsTrigger value="revenue-analytics" className="whitespace-nowrap">Revenue Analytics</TabsTrigger>
            <TabsTrigger value="revenue-management" className="whitespace-nowrap">Revenue Management</TabsTrigger>
            <TabsTrigger value="reports" className="whitespace-nowrap">Report Builder</TabsTrigger>
            <TabsTrigger value="builder" className="whitespace-nowrap">Dashboard Builder</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <DynamicDashboard />
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
