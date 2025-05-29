
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Building, Users, Briefcase, Users as UsersIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useCompanies } from '@/hooks/useCompanies';
import { useIsMobile } from '@/hooks/use-mobile';
import DynamicFormWidget from '@/components/forms/integration/DynamicFormWidget';

const Dashboard = () => {
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

      // Note: This is a placeholder as we don't have a jobs table yet
      // Would be replaced with actual jobs count when implemented
      const jobCount = 256;

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
      <div className="p-4 md:p-6">
        {/* Breadcrumb - hide on small mobile screens */}
        <div className="hidden sm:block mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/superadmin/dashboard">Superadmin</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Superadmin Dashboard</h1>
          <p className="text-muted-foreground text-sm md:text-base">Overview of the JobMojo.ai platform.</p>
        </div>

        {/* Dashboard cards - responsive grid layout */}
        <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {/* Users Card */}
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

          {/* Tenants Card */}
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

          {/* Jobs Card */}
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

          {/* Companies Card */}
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

          {/* Talent Card */}
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

          {/* Contacts Card */}
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

        {/* Additional cards in responsive layout */}
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

          {/* Dynamic Form Widget */}
          <div className="xl:col-span-1">
            <DynamicFormWidget 
              context={{ page: 'dashboard', userType: 'super_admin' }}
              maxForms={3}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
