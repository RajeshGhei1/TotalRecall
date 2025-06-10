
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

import CompanyList from '@/components/superadmin/companies/CompanyList';
import CompanyMetricsDashboard from '@/components/superadmin/companies/CompanyMetricsDashboard';
import CreateCompanyDialog from '@/components/superadmin/companies/CreateCompanyDialog';
import EnhancedBulkUploadDialog from '@/components/superadmin/companies/EnhancedBulkUploadDialog';
import EnhancedExportDialog from '@/components/superadmin/companies/EnhancedExportDialog';
import ApiConnectionDialog from '@/components/superadmin/companies/ApiConnectionDialog';
import ImportHistoryDialog from '@/components/superadmin/companies/ImportHistoryDialog';
import { useCompanies } from '@/hooks/useCompanies';
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
      let importedCount = 0;
      let skippedCount = 0;
      let errorCount = 0;
      let branchOfficesCreated = 0;

      console.log(`Starting bulk import of ${companiesToImport.length} companies...`);

      // Process companies in batches for better performance
      const batchSize = 50;
      const batches = [];
      for (let i = 0; i < companiesToImport.length; i += batchSize) {
        batches.push(companiesToImport.slice(i, i + batchSize));
      }

      const importedCompanies: any[] = [];

      for (const batch of batches) {
        const batchPromises = batch.map(async (companyData, batchIndex) => {
          try {
            // Check for duplicates if skipDuplicates is enabled
            if (options.skipDuplicates) {
              const existingCompany = companies?.find(
                c => c.name.toLowerCase() === companyData.name?.toLowerCase() ||
                     (companyData.email && c.email?.toLowerCase() === companyData.email?.toLowerCase())
              );
              
              if (existingCompany) {
                skippedCount++;
                return { success: false, reason: 'duplicate' };
              }
            }

            const newCompany = await createCompany.mutateAsync(companyData);
            importedCompanies.push({ company: newCompany, originalIndex: batchIndex });
            importedCount++;
            return { success: true, company: newCompany };
          } catch (error) {
            console.error('Failed to import company:', companyData.name, error);
            errorCount++;
            return { success: false, reason: 'error', error };
          }
        });

        // Wait for batch to complete
        await Promise.all(batchPromises);
      }

      // Create branch offices for imported companies
      if (branchOfficesData && branchOfficesData.length > 0) {
        console.log(`Creating branch offices for ${branchOfficesData.length} companies...`);
        
        for (const branchData of branchOfficesData) {
          const importedCompany = importedCompanies.find(ic => ic.originalIndex === branchData.companyIndex);
          
          if (importedCompany && importedCompany.company) {
            try {
              for (const branchOffice of branchData.branchOffices) {
                const { error } = await supabase
                  .from('company_branch_offices')
                  .insert({
                    company_id: importedCompany.company.id,
                    branch_name: branchOffice.branch_name,
                    branch_type: branchOffice.branch_type,
                    address: branchOffice.address || null,
                    city: branchOffice.city || null,
                    state: branchOffice.state || null,
                    country: branchOffice.country || null,
                    postal_code: branchOffice.postal_code || null,
                    phone: branchOffice.phone || null,
                    email: branchOffice.email || null,
                    gst_number: branchOffice.gst_number || null,
                    is_headquarters: branchOffice.is_headquarters,
                    is_active: branchOffice.is_active
                  });

                if (error) {
                  console.error('Failed to create branch office:', error);
                } else {
                  branchOfficesCreated++;
                }
              }
            } catch (error) {
              console.error('Error creating branch offices for company:', importedCompany.company.name, error);
            }
          }
        }
      }

      await refetch();
      
      // Show comprehensive results
      let message = `Import completed: ${importedCount} companies imported`;
      if (branchOfficesCreated > 0) {
        message += `, ${branchOfficesCreated} branch offices created`;
      }
      if (skippedCount > 0) {
        message += `, ${skippedCount} skipped (duplicates)`;
      }
      if (errorCount > 0) {
        message += `, ${errorCount} failed`;
        toast.error(message);
      } else {
        toast.success(message);
      }

      console.log(`Bulk import completed: ${importedCount} imported, ${branchOfficesCreated} branch offices, ${skippedCount} skipped, ${errorCount} errors`);
      
    } catch (error) {
      console.error('Bulk import error:', error);
      toast.error('Bulk import failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
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
                <CompanyList />
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
          onSubmit={(data) => {
            createCompany.mutate(data);
            setIsCreateDialogOpen(false);
          }}
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
