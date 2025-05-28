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
  Cog
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

const Settings = () => {
  console.log("Rendering SuperAdmin Settings Page");
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  
  return (
    <ErrorBoundary>
      <AdminLayout>
        <TenantProvider>
          <div className="p-6">
            {/* Enhanced Header with Global Tenant Context */}
            <div className="flex flex-col gap-6 mb-8">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
                  <p className="text-lg text-gray-600 mt-2">
                    Manage platform modules, tenant configurations, and system-wide settings
                  </p>
                </div>
                
                {/* Quick Actions Card */}
                <Card className="lg:w-80">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      onClick={() => setShowSetupWizard(true)}
                      className="w-full justify-start gap-2"
                      variant="outline"
                    >
                      <Blocks className="h-4 w-4" />
                      Launch Tenant Setup Wizard
                    </Button>
                    <p className="text-xs text-gray-500">
                      Configure new tenants step-by-step with modules and settings
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Global Tenant Context Selector */}
              <Card className="border-blue-200 bg-blue-50/50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    Tenant Configuration Context
                  </CardTitle>
                  <CardDescription>
                    Select a tenant to configure its modules, settings, and integrations. All configuration tabs will operate within this tenant context.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <GlobalTenantSelector />
                </CardContent>
              </Card>
            </div>
            
            {/* Setup Wizard Component */}
            <ErrorBoundary>
              <SetupWizard 
                open={showSetupWizard} 
                onOpenChange={setShowSetupWizard} 
              />
            </ErrorBoundary>
            
            <Tabs defaultValue="modules" className="w-full">
              <div className="border-b mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                  <TabsList className="w-full lg:w-auto justify-start overflow-x-auto bg-transparent px-0 py-0 h-14">
                    <TabsTrigger value="modules" className="flex items-center gap-2 h-12 px-6">
                      <Blocks className="h-4 w-4" />
                      <span>Modules & Configuration</span>
                    </TabsTrigger>
                    <TabsTrigger value="system" className="flex items-center gap-2 h-12 px-6">
                      <Cog className="h-4 w-4" />
                      <span>System Settings</span>
                    </TabsTrigger>
                    <TabsTrigger value="integrations" className="flex items-center gap-2 h-12 px-6">
                      <Globe className="h-4 w-4" />
                      <span>Integrations</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Tenant Context Indicator in Tab Bar */}
                  <TenantContextIndicator showInHeader={true} className="lg:flex hidden" />
                </div>
              </div>
              
              <ErrorBoundary>
                <TabsContent value="modules" className="mt-6">
                  <div className="space-y-8">
                    {/* Module Registry - Main Feature */}
                    <Card>
                      <CardHeader>
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              <Blocks className="h-5 w-5" />
                              Module Management
                            </CardTitle>
                            <CardDescription>
                              Manage system modules and assign them to tenants
                            </CardDescription>
                          </div>
                          <TenantContextIndicator className="lg:hidden" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ModuleRegistry />
                      </CardContent>
                    </Card>

                    {/* Configuration Tools */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-base">
                            <SettingsIcon className="h-4 w-4" />
                            Custom Fields
                          </CardTitle>
                          <CardDescription className="text-sm">
                            Define global custom fields for all tenants
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <GlobalCustomFieldsManager />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-base">
                            <SettingsIcon className="h-4 w-4" />
                            Dropdown Options
                          </CardTitle>
                          <CardDescription className="text-sm">
                            Manage dropdown options across the platform
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <DropdownOptionsManager />
                        </CardContent>
                      </Card>
                    </div>

                    {/* AI Models */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Bot className="h-5 w-5" />
                          AI Model Configuration
                        </CardTitle>
                        <CardDescription>
                          Configure AI models available to tenants
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <AIModelIntegration />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </ErrorBoundary>
              
              <ErrorBoundary>
                <TabsContent value="system" className="mt-6">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <SettingsIcon className="h-5 w-5" />
                          General System Settings
                        </CardTitle>
                        <CardDescription>
                          Configure platform-wide settings and preferences
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <GeneralSettings />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </ErrorBoundary>
              
              <ErrorBoundary>
                <TabsContent value="integrations" className="mt-6">
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Globe className="h-5 w-5" />
                            Social Media Integration
                          </CardTitle>
                          <CardDescription>
                            Configure social media platform connections
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <SocialMediaSettings />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <MessageCircle className="h-5 w-5" />
                            Communication Settings
                          </CardTitle>
                          <CardDescription>
                            Set up email and messaging configurations
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <CommunicationSettings />
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Send className="h-5 w-5" />
                            Outreach Configuration
                          </CardTitle>
                          <CardDescription>
                            Configure outreach and engagement tools
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <OutreachSettings />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Cog className="h-5 w-5" />
                            API Settings
                          </CardTitle>
                          <CardDescription>
                            Manage API configurations and integrations
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ApiSettings />
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </ErrorBoundary>
            </Tabs>
          </div>
        </TenantProvider>
      </AdminLayout>
    </ErrorBoundary>
  );
};

export default Settings;
