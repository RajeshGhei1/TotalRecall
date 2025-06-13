
import React, { useState } from 'react';
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
import { Plus, Upload, Database, BarChart, Download, History } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import CompanyEnhancedListContainer from '@/components/superadmin/companies/CompanyEnhancedListContainer';
import CompanyMetricsDashboard from '@/components/superadmin/companies/CompanyMetricsDashboard';
import CreateCompanyDialog from '@/components/superadmin/companies/CreateCompanyDialog';
import EnhancedBulkUploadDialog from '@/components/superadmin/companies/EnhancedBulkUploadDialog';
import EnhancedExportDialog from '@/components/superadmin/companies/EnhancedExportDialog';
import ApiConnectionDialog from '@/components/superadmin/companies/ApiConnectionDialog';
import ImportHistoryDialog from '@/components/superadmin/companies/ImportHistoryDialog';
import { useCompanies, Company } from '@/hooks/useCompanies';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { BranchOfficeData } from '@/components/superadmin/companies/utils/csvProcessor';

const Companies = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isApiConnectionOpen, setIsApiConnectionOpen] = useState(false);
  const [isImportHistoryOpen, setIsImportHistoryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("companies");
  
  const { companies, isLoading, createCompany, refetch } = useCompanies();

  const handleBulkImport = async (
    companiesToImport: Partial<any>[], 
    options: { skipDuplicates: boolean },
    branchOfficesData?: Array<{ companyIndex: number; branchOffices: BranchOfficeData[] }>
  ) => {
    try {
      // Use the new enhanced duplicate detection system
      const { CompanyBulkUploadProcessor } = await import('@/components/common/bulk-upload/CompanyBulkUploadProcessor');
      
      const defaultStrategy = {
        primaryAction: 'skip' as const,
        emailMatches: 'merge' as const,
        phoneMatches: 'skip' as const,
        nameMatches: 'review' as const,
        linkedinMatches: 'merge' as const,
        confidenceThreshold: 0.8
      };

      const mergeOptions = {
        overwriteEmpty: true,
        mergeArrays: true,
        keepMostRecent: true,
        preserveExisting: false
      };

      console.log(`Starting enhanced bulk import of ${companiesToImport.length} companies with duplicate detection...`);

      const results = await CompanyBulkUploadProcessor.processCompaniesWithDuplicateHandling(
        companiesToImport as any[],
        defaultStrategy,
        mergeOptions
      );

      await refetch();
      
      // Show comprehensive results
      let message = `Import completed: ${results.successful} companies imported`;
      if (results.duplicates_merged > 0) {
        message += `, ${results.duplicates_merged} merged`;
      }
      if (results.duplicates_skipped > 0) {
        message += `, ${results.duplicates_skipped} skipped (duplicates)`;
      }
      if (results.failed > 0) {
        message += `, ${results.failed} failed`;
        toast.error(message);
      } else {
        toast.success(message);
      }

      if (results.duplicates_found > 0) {
        toast.info(`Duplicate detection: ${results.duplicates_found} found, ${results.duplicates_skipped} skipped, ${results.duplicates_merged} merged`);
      }

      console.log(`Enhanced bulk import completed with duplicate detection: ${results.successful} imported, ${results.duplicates_merged} merged, ${results.duplicates_skipped} skipped, ${results.failed} errors`);
      
    } catch (error) {
      console.error('Enhanced bulk import error:', error);
      toast.error('Bulk import failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
      throw error;
    }
  };

  const handleCreateCompany = (data: any) => {
    // Fix: Ensure name is required and properly typed
    const companyData: Omit<Company, 'id' | 'created_at' | 'updated_at' | 'tr_id'> = {
      name: data.name || '', // Ensure name is always a string
      website: data.website || null,
      size: data.size || null,
      description: data.description || null,
      domain: data.domain || null,
      location: data.location || null,
      email: data.email || null,
      phone: data.phone || null,
      linkedin: data.linkedin || null,
      twitter: data.twitter || null,
      facebook: data.facebook || null,
      hierarchy_level: data.hierarchyLevel || 0,
      cin: data.cin || null,
      companystatus: data.companyStatus || null,
      registeredofficeaddress: data.registeredOfficeAddress || null,
      registrationdate: data.registrationDate ? new Date(data.registrationDate).toISOString() : null,
      registeredemailaddress: data.registeredEmailAddress || null,
      noofdirectives: data.noOfDirectives || null,
      globalregion: data.globalRegion || null,
      country: data.country || null,
      region: data.region || null,
      holocation: data.hoLocation || null,
      industry1: data.industry1 || null,
      industry2: data.industry2 || null,
      industry3: data.industry3 || null,
      companysector: data.companySector || null,
      companytype: data.companyType || null,
      entitytype: data.entityType || null,
      noofemployee: data.noOfEmployee || null,
      segmentaspernumberofemployees: data.segmentAsPerNumberOfEmployees || null,
      turnover: data.turnOver || null,
      segmentasperturnover: data.segmentAsPerTurnover || null,
      turnoveryear: data.turnoverYear || null,
      yearofestablishment: data.yearOfEstablishment || null,
      paidupcapital: data.paidupCapital || null,
      segmentasperpaidupcapital: data.segmentAsPerPaidUpCapital || null,
      areaofspecialize: data.areaOfSpecialize || null,
      serviceline: data.serviceLine || null,
      verticles: data.verticles || null,
      companyprofile: data.companyProfile || null,
      parent_company_id: data.parentCompanyId || null,
      company_group_name: data.companyGroupName || null,
      founded: data.founded || null,
    };

    createCompany.mutate(companyData);
    setIsCreateDialogOpen(false);
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
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Company
            </Button>
            <Button variant="outline" onClick={() => setIsBulkUploadOpen(true)}>
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
        </Tabs>

        {/* Enhanced Dialogs */}
        <CreateCompanyDialog
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onSubmit={handleCreateCompany}
          isSubmitting={createCompany.isPending}
        />
        
        <EnhancedBulkUploadDialog
          isOpen={isBulkUploadOpen}
          onClose={() => setIsBulkUploadOpen(false)}
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
