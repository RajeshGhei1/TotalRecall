
import React from 'react';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { SecurityDashboard as SecurityDashboardComponent } from '@/components/superadmin/security/SecurityDashboard';
import AdminLayout from '@/components/AdminLayout';

const SecurityDashboard: React.FC = () => {
  return (
    <AdminLayout>
      <ErrorBoundary>
        <div className="p-4 md:p-6">
          <div className="mb-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/superadmin/dashboard">Super Admin</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Security Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <SecurityDashboardComponent />
        </div>
      </ErrorBoundary>
    </AdminLayout>
  );
};

export default SecurityDashboard;
