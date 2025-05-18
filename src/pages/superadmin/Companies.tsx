
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
import { Plus, Upload, Database } from 'lucide-react';
import CompanyList from '@/components/superadmin/companies/CompanyList';
import CreateCompanyDialog from '@/components/superadmin/companies/CreateCompanyDialog';
import BulkUploadDialog from '@/components/superadmin/companies/BulkUploadDialog';
import ApiConnectionDialog from '@/components/superadmin/companies/ApiConnectionDialog';
import { useCompanies } from '@/hooks/useCompanies';

const Companies = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isApiConnectionOpen, setIsApiConnectionOpen] = useState(false);
  
  const { companies, isLoading, createCompany } = useCompanies();

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

        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
            <p className="text-muted-foreground">Manage companies across all tenants</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Company
            </Button>
            <Button variant="outline" onClick={() => setIsBulkUploadOpen(true)}>
              <Upload className="mr-2 h-4 w-4" /> Bulk Upload
            </Button>
            <Button variant="outline" onClick={() => setIsApiConnectionOpen(true)}>
              <Database className="mr-2 h-4 w-4" /> API Connection
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Companies Management</CardTitle>
            <CardDescription>View and manage all companies in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <CompanyList 
              companies={companies || []} 
              isLoading={isLoading} 
            />
          </CardContent>
        </Card>

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
        
        <BulkUploadDialog 
          isOpen={isBulkUploadOpen}
          onClose={() => setIsBulkUploadOpen(false)}
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
