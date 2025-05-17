import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GlobalCustomFieldsManager from '@/components/superadmin/GlobalCustomFieldsManager';
import DropdownOptionsManager from '@/components/superadmin/DropdownOptionsManager';
import AIModelIntegration from '@/components/superadmin/AIModelIntegration';
import { 
  Database, 
  ListFilter, 
  Bot, 
  Settings as SettingsIcon, 
  Globe, 
  MessageCircle, 
  Send,
  Blocks
} from 'lucide-react';
import { Button } from '@/components/ui/button';

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
            className="px-4 py-2 flex items-center gap-2 shadow-sm hover:bg-slate-100"
          >
            <Blocks className="h-4 w-4" />
            Tenant Setup Wizard
          </Button>
        </div>
        
        {/* Setup Wizard Component */}
        <SetupWizard 
          open={showSetupWizard} 
          onOpenChange={setShowSetupWizard} 
        />
        
        <Tabs defaultValue="dropdown-options" className="w-full mt-4">
          <div className="border-b mb-6">
            <TabsList className="w-full justify-start overflow-x-auto bg-transparent px-0 py-0 h-14">
              <TabsTrigger value="dropdown-options" className="flex items-center gap-2 h-12">
                <ListFilter className="h-4 w-4" />
                <span>Dropdown Options</span>
              </TabsTrigger>
              <TabsTrigger value="custom-fields" className="flex items-center gap-2 h-12">
                <Database className="h-4 w-4" />
                <span>Custom Fields</span>
              </TabsTrigger>
              <TabsTrigger value="ai-models" className="flex items-center gap-2 h-12">
                <Bot className="h-4 w-4" />
                <span>AI Models</span>
              </TabsTrigger>
              <TabsTrigger value="general" className="flex items-center gap-2 h-12">
                <SettingsIcon className="h-4 w-4" />
                <span>Settings</span>
              </TabsTrigger>
              <TabsTrigger value="social" className="flex items-center gap-2 h-12">
                <Globe className="h-4 w-4" />
                <span>Social Media</span>
              </TabsTrigger>
              <TabsTrigger value="communication" className="flex items-center gap-2 h-12">
                <MessageCircle className="h-4 w-4" />
                <span>Communication</span>
              </TabsTrigger>
              <TabsTrigger value="outreach" className="flex items-center gap-2 h-12">
                <Send className="h-4 w-4" />
                <span>Outreach</span>
              </TabsTrigger>
              <TabsTrigger value="api" className="flex items-center gap-2 h-12">
                <Database className="h-4 w-4" />
                <span>API</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="dropdown-options" className="mt-6">
            <DropdownOptionsManager />
          </TabsContent>
          
          <TabsContent value="custom-fields" className="mt-6">
            <GlobalCustomFieldsManager />
          </TabsContent>
          
          <TabsContent value="ai-models" className="mt-6">
            <AIModelIntegration />
          </TabsContent>
          
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
      </div>
    </AdminLayout>
  );
};

export default Settings;
