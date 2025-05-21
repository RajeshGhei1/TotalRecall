
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from '@/integrations/supabase/client';
import TalentMetricsDashboard from '@/components/talent/TalentMetricsDashboard';
import ContactMetricsDashboard from '@/components/contacts/ContactMetricsDashboard';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Enhanced company dashboard
import CompanyRevenueChart from "./charts/CompanyRevenueChart";
import CompanyGrowthChart from "./charts/CompanyGrowthChart";
import TalentHiringTrends from "./charts/TalentHiringTrends";
import JobPostingsOverview from "./charts/JobPostingsOverview";

const AnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = React.useState("overview");

  // Get total counts
  const { data: overviewData } = useQuery({
    queryKey: ['dashboardOverview'],
    queryFn: async () => {
      const [talentsCount, contactsCount, companiesCount] = await Promise.all([
        supabase.from('talents').select('id', { count: 'exact', head: true }),
        supabase.from('people').select('id', { count: 'exact', head: true }),
        supabase.from('companies').select('id', { count: 'exact', head: true })
      ]);
      
      return {
        talents: talentsCount.count || 0,
        contacts: contactsCount.count || 0, 
        companies: companiesCount.count || 0
      };
    }
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
          <CardDescription>
            Comprehensive analytics and reporting for your recruitment platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="talent">Talent</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
              <TabsTrigger value="companies">Companies</TabsTrigger>
              <TabsTrigger value="recruiting">Recruiting</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Talents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{overviewData?.talents || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">Talents in the database</p>
                  </CardContent>
                </Card>
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
              
              <Alert>
                <AlertTitle>Analytics Insights</AlertTitle>
                <AlertDescription>
                  Use the tabs above to explore detailed analytics for each entity type, or create custom reports using the Report Builder.
                </AlertDescription>
              </Alert>
            </TabsContent>
            
            <TabsContent value="talent">
              <TalentMetricsDashboard />
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
            
            <TabsContent value="recruiting">
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Hiring Trends</CardTitle>
                      <CardDescription>Talent hiring data over time</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <TalentHiringTrends />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Job Postings</CardTitle>
                      <CardDescription>Job posting metrics</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <JobPostingsOverview />
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
