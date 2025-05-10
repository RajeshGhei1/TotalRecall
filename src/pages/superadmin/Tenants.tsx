
import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Plus, UserPlus } from 'lucide-react';
import TenantUserManager from '@/components/TenantUserManager';
import ExtendedTenantForm from '@/components/superadmin/ExtendedTenantForm';

interface Tenant {
  id: string;
  name: string;
  domain?: string;  // Make domain optional to match database schema
  description?: string;
  created_at: string;
}

const Tenants = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [isUserManagerOpen, setIsUserManagerOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: tenants = [], isLoading } = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Tenant[];  // Cast to match our interface
    },
  });

  // This mutation will need to be updated to handle the extended tenant data
  const createTenant = useMutation({
    mutationFn: async (tenantData: any) => {
      // Extract the basic tenant data that the database expects
      const basicTenantData = {
        name: tenantData.name,
        domain: tenantData.domain || tenantData.webSite, // Use website as domain if domain not provided
        description: tenantData.companyProfile, // Use company profile as description
      };

      const { data, error } = await supabase
        .from('tenants')
        .insert([basicTenantData])
        .select()
        .single();

      if (error) throw error;
      
      // In a real implementation, you would store the extended tenant data
      // in another table with a foreign key to the tenant id
      // For now, we'll just log it to show it's captured
      console.log("Extended tenant data to be stored:", tenantData);
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      setIsCreateDialogOpen(false);
      toast({
        title: 'Tenant created',
        description: 'The tenant has been created successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create tenant: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const handleCreateTenant = (data: any) => {
    createTenant.mutate(data);
  };

  const handleOpenUserManager = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsUserManagerOpen(true);
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
              <BreadcrumbPage>Tenants</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tenants</h1>
            <p className="text-muted-foreground">
              Manage organizations using the JobMojo.ai platform
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Tenant
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tenant List</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-6">Loading...</div>
            ) : tenants.length === 0 ? (
              <div className="text-center p-6 text-muted-foreground">
                No tenants found. Click "Add Tenant" to create a new one.
              </div>
            ) : (
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Domain</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tenants.map((tenant) => (
                      <TableRow key={tenant.id}>
                        <TableCell className="font-medium">{tenant.name}</TableCell>
                        <TableCell>{tenant.domain}</TableCell>
                        <TableCell>
                          {new Date(tenant.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenUserManager(tenant)}
                            className="ml-2"
                          >
                            <UserPlus className="mr-2 h-4 w-4" /> Manage Users
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Create New Tenant</DialogTitle>
            <DialogDescription>
              Add a new organization to the JobMojo.ai platform.
            </DialogDescription>
          </DialogHeader>

          <ExtendedTenantForm
            onSubmit={handleCreateTenant}
            isSubmitting={createTenant.isPending}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {selectedTenant && (
        <TenantUserManager
          tenantId={selectedTenant.id}
          tenantName={selectedTenant.name}
          isOpen={isUserManagerOpen}
          onClose={() => setIsUserManagerOpen(false)}
        />
      )}
    </AdminLayout>
  );
};

export default Tenants;
