
import React, { useEffect } from 'react';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { AIOrchestrationManager } from '@/components/superadmin/ai/AIOrchestrationManager';
import { enhancedAIOrchestrationService } from '@/services/ai/enhancedOrchestrationService';
import AdminLayout from '@/components/AdminLayout';

const AIOrchestration: React.FC = () => {
  useEffect(() => {
    const initializeService = async () => {
      try {
        await enhancedAIOrchestrationService.initialize();
      } catch (error) {
        console.error('Failed to initialize AI orchestration service:', error);
      }
    };

    initializeService();
  }, []);

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

          <AIOrchestrationManager />
        </div>
      </ErrorBoundary>
    </AdminLayout>
  );
};

export default AIOrchestration;
