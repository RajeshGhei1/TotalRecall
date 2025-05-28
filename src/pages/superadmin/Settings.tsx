
import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import GlobalCustomFieldsManager from '@/components/superadmin/GlobalCustomFieldsManager';
import DropdownOptionsManager from '@/components/superadmin/dropdown-manager/DropdownOptionsManager';
import AIModelIntegration from '@/components/superadmin/AIModelIntegration';
import { 
  Bot, 
  Settings as SettingsIcon, 
  Globe, 
  MessageCircle, 
  Send,
  Blocks,
  Users,
  Cog,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Import our updated super admin settings components
import GeneralSettings from '@/components/superadmin/settings/GeneralSettings';
import SocialMediaSettings from '@/components/superadmin/settings/SocialMediaSettings';
import CommunicationSettings from '@/components/superadmin/settings/CommunicationSettings';
import OutreachSettings from '@/components/superadmin/settings/OutreachSettings';
import ApiSettings from '@/components/superadmin/settings/ApiSettings';
import SetupWizard from '@/components/superadmin/settings/SetupWizard';
import ModuleRegistry from '@/components/superadmin/settings/ModuleRegistry';

// Import new tenant context components
import { TenantProvider } from '@/contexts/TenantContext';
import GlobalTenantSelector from '@/components/superadmin/settings/shared/GlobalTenantSelector';
import TenantContextIndicator from '@/components/superadmin/settings/shared/TenantContextIndicator';

// Import new refactored components
import SettingsHeader from '@/components/superadmin/settings/layout/SettingsHeader';
import SettingsTabs from '@/components/superadmin/settings/layout/SettingsTabs';
import ModulesTabContent from '@/components/superadmin/settings/tabs/ModulesTabContent';
import SystemTabContent from '@/components/superadmin/settings/tabs/SystemTabContent';
import IntegrationsTabContent from '@/components/superadmin/settings/tabs/IntegrationsTabContent';

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
                <TabsContent value="system" className="mt-6">
                  <SystemTabContent />
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
