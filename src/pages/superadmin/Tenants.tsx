
import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import TenantUserManager from '@/components/TenantUserManager';
import TenantsHeader from '@/components/superadmin/TenantsHeader';
import TenantList from '@/components/superadmin/TenantList';
import CreateTenantDialog from '@/components/superadmin/CreateTenantDialog';
import CustomFieldsDialog from '@/components/superadmin/CustomFieldsDialog';
import { TenantFormValues } from '@/components/superadmin/tenant-form';
import { useCustomFields } from '@/hooks/useCustomFields';

interface Tenant {
  id: string;
  name: string;
  domain?: string;
  description?: string;
  created_at: string;
}

const Tenants = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [isUserManagerOpen, setIsUserManagerOpen] = useState(false);
  const [isCustomFieldsOpen, setIsCustomFieldsOpen] = useState(false);

  const queryClient = useQueryClient();
  const { saveCustomFieldValues } = useCustomFields();

  // Fetch tenants from the database
  const { data: tenants = [], isLoading } = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Tenant[];
    },
  });

  // Extract custom field values from form data
  const extractCustomFieldValues = (formData: TenantFormValues) => {
    const customFields: Record<string, any> = {};
    
    // Loop through all form values and extract those that start with "custom_"
    Object.entries(formData).forEach(([key, value]) => {
      if (key.startsWith('custom_')) {
        const fieldKey = key.replace('custom_', '');
        customFields[fieldKey] = value;
      }
    });
    
    return customFields;
  };

  // Mutation for creating a new tenant
  const createTenant = useMutation({
    mutationFn: async (tenantData: TenantFormValues) => {
      console.log("Form data received:", tenantData);
      
      // Extract the basic tenant data that the database expects
      const basicTenantData = {
        name: tenantData.name,
        domain: tenantData.domain || tenantData.webSite, // Use website as domain if domain not provided
        description: tenantData.companyProfile, // Use company profile as description
      };

      console.log("Sending to database:", basicTenantData);

      const { data, error } = await supabase
        .from('tenants')
        .insert([basicTenantData])
        .select()
        .single();

      if (error) throw error;
      
      // Handle custom fields if any exist
      const customFieldValues = extractCustomFieldValues(tenantData);
      if (Object.keys(customFieldValues).length > 0) {
        await saveCustomFieldValues('tenant', data.id, customFieldValues);
      }
      
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
    onError: (error: any) => {
      console.error("Error creating tenant:", error);
      toast({
        title: 'Error',
        description: `Failed to create tenant: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const handleCreateTenant = (data: TenantFormValues) => {
    console.log("Submitting tenant form:", data);
    createTenant.mutate(data);
  };

  const handleOpenUserManager = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsUserManagerOpen(true);
  };

  const handleOpenCustomFields = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsCustomFieldsOpen(true);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <TenantsHeader onCreateTenant={() => setIsCreateDialogOpen(true)} />
        
        <TenantList 
          tenants={tenants} 
          isLoading={isLoading} 
          onOpenUserManager={handleOpenUserManager} 
          onOpenCustomFields={handleOpenCustomFields} 
        />

        <CreateTenantDialog
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onSubmit={handleCreateTenant}
          isSubmitting={createTenant.isPending}
        />

        {selectedTenant && (
          <>
            <TenantUserManager
              tenantId={selectedTenant.id}
              tenantName={selectedTenant.name}
              isOpen={isUserManagerOpen}
              onClose={() => setIsUserManagerOpen(false)}
            />
            
            <CustomFieldsDialog
              tenantId={selectedTenant.id}
              tenantName={selectedTenant.name}
              isOpen={isCustomFieldsOpen}
              onClose={() => setIsCustomFieldsOpen(false)}
            />
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default Tenants;
