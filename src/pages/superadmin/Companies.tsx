
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
import { Plus, Upload, Database, BarChart, Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import CompanyList from '@/components/superadmin/companies/CompanyList';
import CompanyMetricsDashboard from '@/components/superadmin/companies/CompanyMetricsDashboard';
import CreateCompanyDialog from '@/components/superadmin/companies/CreateCompanyDialog';
import EnhancedBulkUploadDialog from '@/components/superadmin/companies/EnhancedBulkUploadDialog';
import EnhancedExportDialog from '@/components/superadmin/companies/EnhancedExportDialog';
import ApiConnectionDialog from '@/components/superadmin/companies/ApiConnectionDialog';
import { useCompanies } from '@/hooks/useCompanies';
import { toast } from 'sonner';

const Companies = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isApiConnectionOpen, setIsApiConnectionOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("companies");
  
  const { companies, isLoading, createCompany, refetch } = useCompanies();

  const handleBulkImport = async (companiesToImport: Partial<any>[], options: { skipDuplicates: boolean }) => {
    try {
      let importedCount = 0;
      let skippedCount = 0;

      for (const companyData of companiesToImport) {
        try {
          // Check for duplicates if skipDuplicates is enabled
          if (options.skipDuplicates) {
            const existingCompany = companies?.find(
              c => c.name.toLowerCase() === companyData.name?.toLowerCase() ||
                   (companyData.email && c.email?.toLowerCase() === companyData.email?.toLowerCase())
            );
            
            if (existingCompany) {
              skippedCount++;
              continue;
            }
          }

          await createCompany.mutateAsync(companyData);
          importedCount++;
        } catch (error) {
          console.error('Failed to import company:', companyData.name, error);
        }
      }

      await refetch();
      
      if (skippedCount > 0) {
        toast.success(`Import completed: ${importedCount} imported, ${skippedCount} skipped (duplicates)`);
      } else {
        toast.success(`Successfully imported ${importedCount} companies`);
      }
    } catch (error) {
      console.error('Bulk import error:', error);
      toast.error('Bulk import failed');
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
            <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
            <p className="text-muted-foreground">Manage companies across all tenants</p>
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
            <Button variant="outline" onClick={() => setIsApiConnectionOpen(true)}>
              <Database className="mr-2 h-4 w-4" /> API Connection
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="companies">Companies List</TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-1">
              <BarChart className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="companies">
            <Card>
              <CardHeader>
                <CardTitle>Companies Management</CardTitle>
                <CardDescription>View and manage all companies in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <CompanyList />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="dashboard">
            <Card>
              <CardHeader>
                <CardTitle>Companies Dashboard</CardTitle>
                <CardDescription>Overview and metrics of all companies</CardDescription>
              </CardHeader>
              <CardContent>
                <CompanyMetricsDashboard />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
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
        
        <ApiConnectionDialog
          isOpen={isApiConnectionOpen}
          onClose={() => setIsApiConnectionOpen(false)}
        />
      </div>
    </AdminLayout>
  );
};

export default Companies;
