
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Plus } from 'lucide-react';

interface TenantsHeaderProps {
  onCreateTenant: () => void;
}

const TenantsHeader = ({ onCreateTenant }: TenantsHeaderProps) => {
  return (
    <>
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
        <Button onClick={onCreateTenant}>
          <Plus className="mr-2 h-4 w-4" /> Add Tenant
        </Button>
      </div>
    </>
  );
};

export default TenantsHeader;
