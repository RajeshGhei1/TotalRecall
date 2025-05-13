
import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GlobalCustomFieldsManager from '@/components/superadmin/GlobalCustomFieldsManager';
import DropdownOptionsManager from '@/components/superadmin/DropdownOptionsManager';
import AIModelIntegration from '@/components/superadmin/AIModelIntegration';
import { Database, ListFilter, Bot, Settings as SettingsIcon, Globe, MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CountryOptionsProvider } from '@/components/customFields/form';

// Import our updated super admin settings components
import GeneralSettings from '@/components/superadmin/settings/GeneralSettings';
import SocialMediaSettings from '@/components/superadmin/settings/SocialMediaSettings';
import CommunicationSettings from '@/components/superadmin/settings/CommunicationSettings';
import OutreachSettings from '@/components/superadmin/settings/OutreachSettings';
import ApiSettings from '@/components/superadmin/settings/ApiSettings';
import SetupWizard from '@/components/superadmin/settings/SetupWizard';

const Settings = () => {
  console.log("Rendering SuperAdmin Settings Page");
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">System Settings</h1>
          <Button 
            variant="outline" 
            onClick={() => setShowSetupWizard(true)}
          >
            Tenant Setup Wizard
          </Button>
        </div>
        
        {/* Setup Wizard Component */}
        <SetupWizard 
          open={showSetupWizard} 
          onOpenChange={setShowSetupWizard} 
        />
        
        <CountryOptionsProvider>
          <Tabs defaultValue="dropdown-options" className="space-y-6">
            <TabsList className="mb-4 grid grid-cols-4 lg:grid-cols-8 w-full h-auto">
              <TabsTrigger value="dropdown-options" className="flex items-center gap-1">
                <ListFilter className="h-4 w-4" />
                <span className="hidden md:inline">Dropdown</span> Options
              </TabsTrigger>
              <TabsTrigger value="custom-fields" className="flex items-center gap-1">
                <Database className="h-4 w-4" />
                <span className="hidden md:inline">Custom</span> Fields
              </TabsTrigger>
              <TabsTrigger value="ai-models" className="flex items-center gap-1">
                <Bot className="h-4 w-4" />
                AI Models
              </TabsTrigger>
              <TabsTrigger value="general" className="flex items-center gap-1">
                <SettingsIcon className="h-4 w-4" />
                General
              </TabsTrigger>
              <TabsTrigger value="social" className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                <span className="hidden md:inline">Social</span> Media
              </TabsTrigger>
              <TabsTrigger value="communication" className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                <span className="hidden md:inline">Communication</span>
                <span className="inline md:hidden">Comm</span>
              </TabsTrigger>
              <TabsTrigger value="outreach" className="flex items-center gap-1">
                <Send className="h-4 w-4" />
                Outreach
              </TabsTrigger>
              <TabsTrigger value="api" className="flex items-center gap-1">
                <Database className="h-4 w-4" />
                API
              </TabsTrigger>
            </TabsList>
            
            {/* Original Super Admin Tabs */}
            <TabsContent value="dropdown-options" className="mt-6">
              <DropdownOptionsManager />
            </TabsContent>
            
            <TabsContent value="custom-fields" className="mt-6">
              <GlobalCustomFieldsManager />
            </TabsContent>
            
            <TabsContent value="ai-models" className="mt-6">
              <AIModelIntegration />
            </TabsContent>
            
            {/* New Tenant Admin Replicated Tabs */}
            <TabsContent value="general" className="mt-6">
              <GeneralSettings />
            </TabsContent>
            
            <TabsContent value="social" className="mt-6">
              <SocialMediaSettings />
            </TabsContent>
            
            <TabsContent value="communication" className="mt-6">
              <CommunicationSettings />
            </TabsContent>
            
            <TabsContent value="outreach" className="mt-6">
              <OutreachSettings />
            </TabsContent>
            
            <TabsContent value="api" className="mt-6">
              <ApiSettings />
            </TabsContent>
          </Tabs>
        </CountryOptionsProvider>
      </div>
    </AdminLayout>
  );
};

export default Settings;
