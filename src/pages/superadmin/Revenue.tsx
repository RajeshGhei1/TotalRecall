
import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import RevenueOverview from '@/components/superadmin/revenue/RevenueOverview';
import SubscriptionManagement from '@/components/superadmin/revenue/SubscriptionManagement';
import InvoiceList from '@/components/superadmin/revenue/InvoiceList';
import PaymentHistory from '@/components/superadmin/revenue/PaymentHistory';

const Revenue = () => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/superadmin/dashboard">Superadmin</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Revenue Management</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Revenue Management</h1>
            <p className="text-muted-foreground mt-1">
              Monitor and manage billing, subscriptions, and revenue
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="payments">Payment History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
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
    </AdminLayout>
  );
};

export default Revenue;
