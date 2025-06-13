
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import { TabsContent } from '@/components/ui/tabs';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import GlobalSettingsHeader from '@/components/superadmin/global-settings/GlobalSettingsHeader';
import GlobalSettingsTabs from '@/components/superadmin/global-settings/GlobalSettingsTabs';
import GeneralTab from '@/components/superadmin/global-settings/tabs/GeneralTab';
import SecurityTab from '@/components/superadmin/global-settings/tabs/SecurityTab';
import PerformanceTab from '@/components/superadmin/global-settings/tabs/PerformanceTab';
import MaintenanceTab from '@/components/superadmin/global-settings/tabs/MaintenanceTab';
import NotificationsTab from '@/components/superadmin/global-settings/tabs/NotificationsTab';
import EmailTab from '@/components/superadmin/global-settings/tabs/EmailTab';
import SystemTab from '@/components/superadmin/global-settings/tabs/SystemTab';
import UsersTab from '@/components/superadmin/global-settings/tabs/UsersTab';

const GlobalSettings = () => {
  console.log("Rendering SuperAdmin Global Settings Page");
  
  return (
    <ErrorBoundary>
      <AdminLayout>
        <div className="p-6">
          <GlobalSettingsHeader />
          
          <ErrorBoundary>
            <GlobalSettingsTabs>
              <TabsContent value="general" className="mt-6">
                <GeneralTab />
              </TabsContent>
              
              <TabsContent value="security" className="mt-6">
                <SecurityTab />
              </TabsContent>
              
              <TabsContent value="performance" className="mt-6">
                <PerformanceTab />
              </TabsContent>
              
              <TabsContent value="maintenance" className="mt-6">
                <MaintenanceTab />
              </TabsContent>
              
              <TabsContent value="notifications" className="mt-6">
                <NotificationsTab />
              </TabsContent>
              
              <TabsContent value="email" className="mt-6">
                <EmailTab />
              </TabsContent>
              
              <TabsContent value="system" className="mt-6">
                <SystemTab />
              </TabsContent>
              
              <TabsContent value="users" className="mt-6">
                <UsersTab />
              </TabsContent>
            </GlobalSettingsTabs>
          </ErrorBoundary>
        </div>
      </AdminLayout>
    </ErrorBoundary>
  );
};

export default GlobalSettings;
