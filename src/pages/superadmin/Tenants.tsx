
import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import TenantUserManager from '@/components/TenantUserManager';
import TenantsHeader from '@/components/superadmin/TenantsHeader';
import TenantList from '@/components/superadmin/TenantList';
import CreateTenantDialog from '@/components/superadmin/CreateTenantDialog';
import CustomFieldsDialog from '@/components/superadmin/CustomFieldsDialog';
import { TenantFormValues } from '@/components/superadmin/tenant-form';
import { useTenants, Tenant } from '@/hooks/useTenants';

const Tenants = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [isUserManagerOpen, setIsUserManagerOpen] = useState(false);
  const [isCustomFieldsOpen, setIsCustomFieldsOpen] = useState(false);

  const { tenants, isLoading, createTenant } = useTenants();

  const handleCreateTenant = (data: TenantFormValues) => {
    createTenant.mutate(data);
    setIsCreateDialogOpen(false);
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
