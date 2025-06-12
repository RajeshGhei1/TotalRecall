
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from '@/integrations/supabase/client';
import ContactMetricsDashboard from '@/components/contacts/ContactMetricsDashboard';

// Enhanced company dashboard
import CompanyRevenueChart from "./charts/CompanyRevenueChart";
import CompanyGrowthChart from "./charts/CompanyGrowthChart";

const AnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = React.useState("overview");

  // Get total counts
  const { data: overviewData } = useQuery({
    queryKey: ['dashboardOverview'],
    queryFn: async () => {
      const [contactsCount, companiesCount] = await Promise.all([
        supabase.from('people').select('id', { count: 'exact', head: true }),
        supabase.from('companies').select('id', { count: 'exact', head: true })
      ]);
      
      return {
        contacts: contactsCount.count || 0, 
        companies: companiesCount.count || 0
      };
    }
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Operational Analytics Dashboard</CardTitle>
          <CardDescription>
            Analytics and reporting for core business operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
              <TabsTrigger value="companies">Companies</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Business Contacts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{overviewData?.contacts || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">Contacts in the database</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Companies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{overviewData?.companies || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">Companies in the database</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Entity Growth</CardTitle>
                    <CardDescription>Growth of entities over time</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <CompanyGrowthChart />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Trends</CardTitle>
                    <CardDescription>Revenue trends across time periods</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <CompanyRevenueChart />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="contacts">
              <ContactMetricsDashboard />
            </TabsContent>
            
            <TabsContent value="companies">
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Company Growth</CardTitle>
                      <CardDescription>Growth metrics for companies</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <CompanyGrowthChart />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue Analysis</CardTitle>
                      <CardDescription>Revenue breakdown by company</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <CompanyRevenueChart />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
