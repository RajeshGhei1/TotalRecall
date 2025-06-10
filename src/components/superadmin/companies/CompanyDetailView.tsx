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
import { ArrowLeft, Building, Users, Network, BarChart3, Building2, Edit, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Import sections
import RelationshipsSection from './sections/RelationshipsSection';
import PeopleSection from './sections/PeopleSection';
import CompanyOrgChart from './charts/CompanyOrgChart';
import { BranchOfficeManager } from './sections/BranchOfficeManager';
import CompanyHierarchyDisplay from './sections/CompanyHierarchyDisplay';
import { EditCompanyDialog } from './EditCompanyDialog';
import CompanyDeleteDialog from './CompanyDeleteDialog';

const CompanyDetailView: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const { companies, isLoading, updateCompany } = useCompanies();
  const company = companies?.find(c => c.id === companyId);
  const parentCompany = company?.parent_company_id 
    ? companies?.find(c => c.id === company.parent_company_id)
    : null;

  const handleEditSubmit = (data: any) => {
    if (company) {
      updateCompany.mutate(
        { id: company.id, companyData: data },
        {
          onSuccess: () => {
            setIsEditDialogOpen(false);
          }
        }
      );
    }
  };

  const handleDeleteSuccess = () => {
    setIsDeleteDialogOpen(false);
    // Navigate back to companies list after successful deletion
    navigate('/superadmin/companies');
  };

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
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => setIsEditDialogOpen(true)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Company
            </Button>
            <Button 
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Company
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/superadmin/companies')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Companies
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="people" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              People
            </TabsTrigger>
            <TabsTrigger value="branches" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Branches
            </TabsTrigger>
            <TabsTrigger value="org-chart" className="flex items-center gap-2">
              <Network className="h-4 w-4" />
              Org Chart
            </TabsTrigger>
            <TabsTrigger value="relationships" className="flex items-center gap-2">
              <Network className="h-4 w-4" />
              Relationships
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <p className="text-sm text-gray-900">{company.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Industry</label>
                      <p className="text-sm text-gray-900">{company.industry || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Location</label>
                      <p className="text-sm text-gray-900">{company.location || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Size</label>
                      <p className="text-sm text-gray-900">{company.size || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Website</label>
                      <p className="text-sm text-gray-900">{company.website || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-sm text-gray-900">{company.email || 'Not specified'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="h-5 w-5" />
                    Group Structure
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Parent Company</label>
                      <p className="text-sm text-gray-900">
                        {parentCompany ? (
                          <Button
                            variant="link"
                            className="p-0 h-auto text-sm"
                            onClick={() => navigate(`/superadmin/companies/${parentCompany.id}`)}
                          >
                            {parentCompany.name}
                          </Button>
                        ) : (
                          'None (Root Company)'
                        )}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Company Group</label>
                      <p className="text-sm text-gray-900">{company.company_group_name || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Hierarchy Level</label>
                      <p className="text-sm text-gray-900">Level {company.hierarchy_level || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Company Hierarchy Visualization */}
            <CompanyHierarchyDisplay 
              companyId={company.id} 
              currentCompanyId={company.id}
            />
          </TabsContent>

          <TabsContent value="people">
            <PeopleSection form={{ getValues: () => ({ id: company.id }) } as any} showFullView={true} />
          </TabsContent>

          <TabsContent value="branches">
            <BranchOfficeManager companyId={company.id} companyName={company.name} />
          </TabsContent>

          <TabsContent value="org-chart">
            <CompanyOrgChart companyId={company.id} />
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
        </Tabs>

        {/* Edit Company Dialog */}
        {company && (
          <EditCompanyDialog
            isOpen={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            company={company}
            onSubmit={handleEditSubmit}
            isSubmitting={updateCompany.isPending}
          />
        )}

        {/* Delete Company Dialog */}
        <CompanyDeleteDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          company={company}
          allCompanies={companies || []}
        />
      </div>
    </AdminLayout>
  );
};

export default CompanyDetailView;
