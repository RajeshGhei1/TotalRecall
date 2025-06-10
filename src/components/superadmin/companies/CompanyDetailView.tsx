
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCompanies } from '@/hooks/useCompanies';
import AdminLayout from '@/components/AdminLayout';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Building, Users, Network, BarChart3 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Import sections
import BasicInfoSection from './sections/BasicInfoSection';
import ContactDetailsSection from './sections/ContactDetailsSection';
import SocialMediaSection from './sections/SocialMediaSection';
import GroupStructureSection from './sections/GroupStructureSection';
import PeopleSection from './sections/PeopleSection';
import RelationshipsSection from './sections/RelationshipsSection';

const CompanyDetailView: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  const { companies, isLoading } = useCompanies();
  const company = companies?.find(c => c.id === companyId);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <Skeleton className="h-6 w-64 mb-6" />
          <div className="mb-6 flex justify-between items-center">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-24" />
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  if (!company) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Company Not Found</h2>
            <p className="text-gray-500 mb-4">The requested company could not be found.</p>
            <Button onClick={() => navigate('/superadmin/companies')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Companies
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/superadmin/dashboard">Superadmin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/superadmin/companies">Companies</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{company.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{company.name}</h1>
            <p className="text-muted-foreground">
              {company.industry && `${company.industry} • `}
              {company.location && `${company.location} • `}
              Company ID: {company.id.slice(0, 8)}...
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/superadmin/companies')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Companies
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="people" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              People
            </TabsTrigger>
            <TabsTrigger value="relationships" className="flex items-center gap-2">
              <Network className="h-4 w-4" />
              Relationships
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BasicInfoSection company={company} readOnly />
              <ContactDetailsSection company={company} readOnly />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SocialMediaSection company={company} readOnly />
              <GroupStructureSection company={company} readOnly />
            </div>
          </TabsContent>

          <TabsContent value="people">
            <PeopleSection companyId={company.id} />
          </TabsContent>

          <TabsContent value="relationships">
            <RelationshipsSection companyId={company.id} companyName={company.name} />
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Company Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                  <p>Advanced analytics dashboard coming soon...</p>
                  <p className="text-sm mt-2">This will include relationship analytics, people metrics, and business insights.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Company Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Building className="h-12 w-12 mx-auto mb-4" />
                  <p>Company settings and preferences coming soon...</p>
                  <p className="text-sm mt-2">This will include edit capabilities, custom fields, and advanced configurations.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default CompanyDetailView;
