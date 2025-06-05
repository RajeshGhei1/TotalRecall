
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
import { AISystemDashboard } from '@/components/ai/AISystemDashboard';
import AdminLayout from '@/components/AdminLayout';

const AIOrchestration: React.FC = () => {
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
                  <BreadcrumbPage>AI Orchestration</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <AISystemDashboard />
        </div>
      </ErrorBoundary>
    </AdminLayout>
  );
};

export default AIOrchestration;
