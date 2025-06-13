
import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { TabsContent } from '@/components/ui/tabs';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import SetupWizard from '@/components/superadmin/settings/SetupWizard';

// Import new tenant context components
import { TenantProvider } from '@/contexts/TenantContext';

// Import new refactored components
import SettingsHeader from '@/components/superadmin/settings/layout/SettingsHeader';
import SettingsTabs from '@/components/superadmin/settings/layout/SettingsTabs';
import ModulesTabContent from '@/components/superadmin/settings/tabs/ModulesTabContent';
import IntegrationsTabContent from '@/components/superadmin/settings/tabs/IntegrationsTabContent';
import FormsTabContent from '@/components/superadmin/settings/tabs/FormsTabContent';

const Settings = () => {
  console.log("Rendering SuperAdmin Settings Page");
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  
  return (
    <ErrorBoundary>
      <AdminLayout>
        <TenantProvider>
          <div className="p-6">
            <SettingsHeader />
            
            <ErrorBoundary>
              <SetupWizard 
                open={showSetupWizard} 
                onOpenChange={setShowSetupWizard} 
              />
            </ErrorBoundary>
            
            <SettingsTabs>
              <ErrorBoundary>
                <TabsContent value="modules" className="mt-6">
                  <ModulesTabContent />
                </TabsContent>
              </ErrorBoundary>
              
              <ErrorBoundary>
                <TabsContent value="forms" className="mt-6">
                  <FormsTabContent />
                </TabsContent>
              </ErrorBoundary>
              
              <ErrorBoundary>
                <TabsContent value="integrations" className="mt-6">
                  <IntegrationsTabContent />
                </TabsContent>
              </ErrorBoundary>
            </SettingsTabs>
          </div>
        </TenantProvider>
      </AdminLayout>
    </ErrorBoundary>
  );
};

export default Settings;
