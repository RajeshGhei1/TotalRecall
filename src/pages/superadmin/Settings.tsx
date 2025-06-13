
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
import { TabsContent } from '@/components/ui/tabs';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import SettingsHeader from '@/components/superadmin/settings/layout/SettingsHeader';
import SettingsTabs from '@/components/superadmin/settings/layout/SettingsTabs';
import ModulesTabContent from '@/components/superadmin/settings/tabs/ModulesTabContent';
import FormsTabContent from '@/components/superadmin/settings/tabs/FormsTabContent';
import IntegrationsTabContent from '@/components/superadmin/settings/tabs/IntegrationsTabContent';

const Settings: React.FC = () => {
  console.log("Rendering SuperAdmin Settings Page");
  
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
                <BreadcrumbPage>Tenant Settings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <ErrorBoundary>
          <SettingsHeader />
          
          <ErrorBoundary>
            <SettingsTabs>
              <TabsContent value="modules" className="mt-6">
                <ModulesTabContent />
              </TabsContent>
              
              <TabsContent value="forms" className="mt-6">
                <FormsTabContent />
              </TabsContent>
              
              <TabsContent value="integrations" className="mt-6">
                <IntegrationsTabContent />
              </TabsContent>
            </SettingsTabs>
          </ErrorBoundary>
        </ErrorBoundary>
      </div>
    </AdminLayout>
  );
};

export default Settings;
