import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Upload, Database, BarChart, Download, History, Settings, Crown, ExternalLink } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

import CompanyEnhancedListContainer from '@/components/superadmin/companies/CompanyEnhancedListContainer';
import CompanyMetricsDashboard from '@/components/superadmin/companies/CompanyMetricsDashboard';
import CreateCompanyDialog from '@/components/superadmin/companies/CreateCompanyDialog';
import EnhancedBulkUploadDialog from '@/components/superadmin/companies/EnhancedBulkUploadDialog';
import EnhancedExportDialog from '@/components/superadmin/companies/EnhancedExportDialog';
import ApiConnectionDialog from '@/components/superadmin/companies/ApiConnectionDialog';
import ImportHistoryDialog from '@/components/superadmin/companies/ImportHistoryDialog';
import ModuleFeatureIntegration from '@/components/modules/ModuleFeatureIntegration';
import { useCompanies, Company } from '@/hooks/useCompanies';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { BranchOfficeData } from '@/components/superadmin/companies/utils/csvProcessor';
import { logger } from '@/utils/logger';

const Companies = () => {
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isBulkUploadDialogOpen, setIsBulkUploadDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isApiConnectionOpen, setIsApiConnectionOpen] = useState(false);
  const [isImportHistoryOpen, setIsImportHistoryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("companies");
  
  const { companies, isLoading, createCompany, refetch } = useCompanies();

  const handleBulkImport = async (
    companiesToImport: Partial<Company>[], 
    options: { skipDuplicates: boolean },
    branchOfficesData?: Array<{ companyIndex: number; branchOffices: BranchOfficeData[] }>
  ): Promise<void> => {
    try {
      const results = [];
      
      for (let i = 0; i < companiesToImport.length; i++) {
        const company = companiesToImport[i];
        
        // Convert the company data to the format expected by the database
        const companyData = {
          name: company.name || '',
          domain: company.website || '',
          website: company.website || '',
          email: company.email || '',
          phone: company.phone || '',
          description: company.description || '',
          location: company.location || '',
          size: company.size || '',
          founded: company.founded || null,
          linkedin: company.linkedin || '',
          twitter: company.twitter || '',
          facebook: company.facebook || '',
          cin: company.cin || '',
          companystatus: company.companystatus || '',
          registeredofficeaddress: company.registeredofficeaddress || '',
          registrationdate: company.registrationdate || '',
          registeredemailaddress: company.registeredemailaddress || '',
          noofdirectives: company.noofdirectives || '',
          globalregion: company.globalregion || '',
          country: company.country || '',
          region: company.region || '',
          holocation: company.holocation || '',
          industry1: company.industry1 || '',
          industry2: company.industry2 || '',
          industry3: company.industry3 || '',
          companysector: company.companysector || '',
          companytype: company.companytype || '',
          entitytype: company.entitytype || '',
          noofemployee: company.noofemployee || '',
          segmentaspernumberofemployees: company.segmentaspernumberofemployees || '',
          turnover: company.turnover || '',
          segmentasperturnover: company.segmentasperturnover || '',
          turnoveryear: company.turnoveryear || '',
          yearofestablishment: company.yearofestablishment || '',
          paidupcapital: company.paidupcapital || '',
          segmentasperpaidupcapital: company.segmentasperpaidupcapital || '',
          companyprofile: company.companyprofile || '',
          areaofspecialize: company.areaofspecialize || '',
          serviceline: company.serviceline || '',
          verticles: company.verticles || '',
          parent_company_id: company.parent_company_id || null,
          company_group_name: company.company_group_name || '',
          hierarchy_level: company.hierarchy_level || 0,
        };

        // Insert company directly into database
        const { data: insertedCompany, error } = await supabase
          .from('companies')
          .insert(companyData)
          .select()
          .single();

        if (error) {
          throw new Error(`Failed to insert company ${company.name}: ${error.message}`);
        }

        results.push(insertedCompany);

        // Note: Branch office functionality removed for now since the table doesn't exist in the schema
        // This can be re-implemented once the branch_offices table is created
        if (branchOfficesData && branchOfficesData.length > 0) {
          const branchData = branchOfficesData.find(b => b.companyIndex === i);
          if (branchData && branchData.branchOffices.length > 0) {
            logger.debug(`Branch offices for company ${company.name} will be processed when branch_offices table is available`);
          }
        }
      }

      // Refresh the companies list
      await refetch();
      
      toast.success(`Successfully imported ${results.length} companies`);
    } catch (error) {
      logger.error('Bulk import failed:', error);
      toast.error(`Bulk import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  };

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
              <BreadcrumbPage>Companies</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Companies Management</h1>
            <p className="text-muted-foreground">
              Comprehensive company management with advanced bulk operations and analytics
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => {
              logger.debug('Create Company button clicked');
              setIsCreateDialogOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" /> Add Company
            </Button>
            <Button variant="outline" onClick={() => setIsBulkUploadDialogOpen(true)}>
              <Upload className="mr-2 h-4 w-4" /> Bulk Import
            </Button>
            <Button variant="outline" onClick={() => setIsExportDialogOpen(true)}>
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
            <Button variant="outline" onClick={() => setIsImportHistoryOpen(true)}>
              <History className="mr-2 h-4 w-4" /> Import History
            </Button>
            <Button variant="outline" onClick={() => setIsApiConnectionOpen(true)}>
              <Database className="mr-2 h-4 w-4" /> API Integration
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="companies">Companies List</TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-1">
              <BarChart className="h-4 w-4" />
              <span>Enhanced Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="features" className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              <span>Module Features</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="companies">
            <Card>
              <CardHeader>
                <CardTitle>Companies Management</CardTitle>
                <CardDescription>
                  View, search, filter, and manage all companies in the system with advanced bulk operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CompanyEnhancedListContainer />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="dashboard">
            <Card>
              <CardHeader>
                <CardTitle>Enhanced Analytics Dashboard</CardTitle>
                <CardDescription>
                  Interactive analytics with advanced filtering, export capabilities, and comprehensive company insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CompanyMetricsDashboard />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features">
            <Card>
              <CardHeader>
                <CardTitle>Companies Module Features</CardTitle>
                <CardDescription>
                  View and manage features assigned to the Companies module through dynamic feature assignment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Global Custom Fields Notice */}
                <Alert className="border-blue-200 bg-blue-50">
                  <Crown className="h-4 w-4 text-blue-600" />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <div>
                        <strong className="text-blue-900">Need to create global custom fields?</strong>
                        <p className="text-blue-700 text-sm mt-1">
                          As Super Admin, create global custom fields that all tenants can use by going to Settings → Custom Fields.
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-blue-600 border-blue-300 hover:bg-blue-100"
                        onClick={() => navigate('/superadmin/settings?tab=custom-fields')}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Go to Settings
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
                
                <ModuleFeatureIntegration 
                  moduleName="companies"
                  entityType="company"
                  className="mt-4"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Enhanced Dialogs */}
        <CreateCompanyDialog
          isOpen={isCreateDialogOpen}
          onClose={() => {
            logger.debug('CreateCompanyDialog onClose called');
            setIsCreateDialogOpen(false);
          }}
          onSubmit={(data) => {
            logger.debug('CreateCompanyDialog onSubmit called with data:', data);
            createCompany.mutate(data);
            setIsCreateDialogOpen(false);
          }}
          isSubmitting={createCompany.isPending}
        />
        
        <EnhancedBulkUploadDialog
          isOpen={isBulkUploadDialogOpen}
          onClose={() => setIsBulkUploadDialogOpen(false)}
          existingCompanies={companies || []}
          onImport={handleBulkImport}
        />

        <EnhancedExportDialog
          isOpen={isExportDialogOpen}
          onClose={() => setIsExportDialogOpen(false)}
          companies={companies || []}
          currentFilters="All companies"
        />

        <ImportHistoryDialog
          isOpen={isImportHistoryOpen}
          onClose={() => setIsImportHistoryOpen(false)}
        />
        
        <ApiConnectionDialog
          isOpen={isApiConnectionOpen}
          onClose={() => setIsApiConnectionOpen(false)}
        />
      </div>
    </AdminLayout>
  );
};

export default Companies;
