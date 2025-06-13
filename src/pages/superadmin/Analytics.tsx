
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { DynamicDashboard } from '@/components/dashboard/DynamicDashboard';

const Analytics: React.FC = () => {
  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/superadmin/dashboard">Super Admin</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>BI Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Business Intelligence Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time analytics and business intelligence overview
          </p>
        </div>

        <DynamicDashboard />
      </div>
    </AdminLayout>
  );
};

export default Analytics;
