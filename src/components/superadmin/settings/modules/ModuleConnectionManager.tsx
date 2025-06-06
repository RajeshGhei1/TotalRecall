
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  ArrowLeft,
  Activity,
  Users
} from 'lucide-react';
import { useTenantContext } from '@/contexts/TenantContext';
import { IntegrationSelector } from './integrations/IntegrationSelector';
import LinkedInIntegration from './integrations/LinkedInIntegration';
import FacebookIntegration from './integrations/FacebookIntegration';

interface ModuleConnectionManagerProps {
  moduleName: string;
  moduleDisplayName: string;
}

export const ModuleConnectionManager: React.FC<ModuleConnectionManagerProps> = ({
  moduleName,
  moduleDisplayName
}) => {
  const { selectedTenantId } = useTenantContext();
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);

  if (!selectedTenantId) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Settings className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Please select a tenant to manage module connections</p>
        </CardContent>
      </Card>
    );
  }

  const handleBackToSelector = () => {
    setSelectedIntegration(null);
  };

  const renderIntegrationComponent = () => {
    switch (selectedIntegration) {
      case 'linkedin':
        return <LinkedInIntegration tenantId={selectedTenantId} />;
      case 'facebook':
        return <FacebookIntegration tenantId={selectedTenantId} />;
      default:
        return (
          <Card>
            <CardContent className="text-center py-8">
              <Settings className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">
                Configuration for this integration is coming soon.
              </p>
              <Button variant="outline" onClick={handleBackToSelector} className="mt-4">
                Back to Integrations
              </Button>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{moduleDisplayName} Configuration</h3>
          <p className="text-sm text-gray-600">
            {selectedIntegration 
              ? `Configure ${selectedIntegration} integration with profile matching and data enrichment` 
              : 'Select and configure integrations for enhanced contact management'
            }
          </p>
        </div>
        {selectedIntegration && (
          <Button variant="outline" onClick={handleBackToSelector}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Integrations
          </Button>
        )}
      </div>

      {selectedIntegration ? (
        renderIntegrationComponent()
      ) : (
        <Tabs defaultValue="integrations" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="integrations">Available Integrations</TabsTrigger>
            <TabsTrigger value="status">Module Status</TabsTrigger>
          </TabsList>

          <TabsContent value="integrations" className="mt-6">
            <IntegrationSelector 
              moduleName={moduleName}
              onSelectIntegration={setSelectedIntegration}
            />
          </TabsContent>

          <TabsContent value="status" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Module Status & Capabilities
                </CardTitle>
                <CardDescription>
                  Current status and available features for {moduleDisplayName.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">Active</div>
                      <div className="text-sm text-gray-600">Module Status</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold">0</div>
                      <div className="text-sm text-gray-600">Active Connections</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold">-</div>
                      <div className="text-sm text-gray-600">Last Activity</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6">
                  <h5 className="font-medium mb-3">Advanced Features</h5>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Profile Matching</span>
                      <Badge variant="default">Available</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Bulk Data Enrichment</span>
                      <Badge variant="default">Available</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Real-time Sync</span>
                      <Badge variant="default">Available</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Analytics & Reporting</span>
                      <Badge variant="default">Available</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">API Access</span>
                      <Badge variant="default">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Webhooks</span>
                      <Badge variant="secondary">Available</Badge>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h6 className="font-medium text-blue-900">Enhanced Contact Management</h6>
                      <p className="text-sm text-blue-800 mt-1">
                        Configure integrations to automatically enrich your contact database with professional profiles, 
                        track engagement, and maintain up-to-date contact information across all platforms.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
