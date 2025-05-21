
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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AnalyticsDashboard from '@/components/reporting/AnalyticsDashboard';
import ReportBuilder from '@/components/reporting/ReportBuilder';

// Create a client
const queryClient = new QueryClient();

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <AdminLayout>
      <QueryClientProvider client={queryClient}>
        <div className="p-3 sm:p-6">
          <Breadcrumb className="mb-4 md:mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/superadmin/dashboard">Superadmin</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Analytics & Reporting</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Analytics & Reporting</h1>
            <p className="text-sm md:text-base text-muted-foreground">Analyze data and create custom reports across your platform</p>
          </div>

          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="dashboard">Analytics Dashboard</TabsTrigger>
              <TabsTrigger value="reports">Report Builder</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard">
              <AnalyticsDashboard />
            </TabsContent>
            
            <TabsContent value="reports">
              <ReportBuilder />
            </TabsContent>
          </Tabs>
        </div>
      </QueryClientProvider>
    </AdminLayout>
  );
};

export default Analytics;
