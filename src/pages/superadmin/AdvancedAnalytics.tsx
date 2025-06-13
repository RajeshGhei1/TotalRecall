
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
import { AdvancedAnalyticsDashboard } from '@/components/superadmin/analytics/AdvancedAnalyticsDashboard';
import AdminLayout from '@/components/AdminLayout';

const AdvancedAnalytics: React.FC = () => {
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
                  <BreadcrumbPage>Advanced Analytics</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <AdvancedAnalyticsDashboard />
        </div>
      </ErrorBoundary>
    </AdminLayout>
  );
};

export default AdvancedAnalytics;
