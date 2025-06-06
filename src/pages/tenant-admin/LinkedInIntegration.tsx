
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTenantContext } from '@/contexts/TenantContext';
import LinkedInCredentialsSetup from '@/components/linkedin/LinkedInCredentialsSetup';
import LinkedInIntegration from '@/components/superadmin/settings/modules/integrations/LinkedInIntegration';
import { 
  Settings,
  Users,
  BarChart3,
  Zap
} from 'lucide-react';

const LinkedInIntegrationPage = () => {
  const { selectedTenantId } = useTenantContext();

  if (!selectedTenantId) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="text-center py-8">
            <Settings className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Please select a tenant to configure LinkedIn integration</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">LinkedIn Integration</h1>
        <p className="text-gray-600 mt-2">
          Configure and manage LinkedIn integration for enhanced contact data and recruitment capabilities.
        </p>
      </div>

      <Tabs defaultValue="setup" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="setup" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Setup
          </TabsTrigger>
          <TabsTrigger value="enrichment" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Data Enrichment
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Automation
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="mt-6">
          <div className="space-y-6">
            <LinkedInCredentialsSetup tenantId={selectedTenantId} />
            <LinkedInIntegration tenantId={selectedTenantId} />
          </div>
        </TabsContent>

        <TabsContent value="enrichment" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Contact Data Enrichment
              </CardTitle>
              <CardDescription>
                Enhance your contact database with LinkedIn profile information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">
                  Data enrichment features will be available once LinkedIn integration is configured.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                LinkedIn Automation
              </CardTitle>
              <CardDescription>
                Automate LinkedIn interactions and workflow processes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Zap className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">
                  Automation features will be available once LinkedIn integration is configured.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                LinkedIn Analytics
              </CardTitle>
              <CardDescription>
                Track LinkedIn integration performance and usage metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">
                  Analytics will be available once LinkedIn integration is active.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LinkedInIntegrationPage;
