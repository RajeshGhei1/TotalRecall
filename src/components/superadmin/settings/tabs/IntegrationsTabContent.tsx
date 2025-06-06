
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings,
  ArrowLeft
} from 'lucide-react';
import { useTenantContext } from '@/contexts/TenantContext';
import { ModuleConnectionManager } from '../modules/ModuleConnectionManager';
import ModuleEnablementManager from '../modules/ModuleEnablementManager';
import { useTenants } from '@/hooks/useTenants';

const IntegrationsTabContent = () => {
  const { selectedTenantId } = useTenantContext();
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'overview' | 'module-config'>('overview');
  
  const { tenants } = useTenants();
  const selectedTenant = tenants?.find(t => t.id === selectedTenantId);

  if (!selectedTenantId) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Settings className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Please select a tenant to manage integrations</p>
        </CardContent>
      </Card>
    );
  }

  if (currentView === 'module-config' && selectedIntegration) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => {
              setCurrentView('overview');
              setSelectedIntegration(null);
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Overview
          </Button>
        </div>
        
        <ModuleConnectionManager
          moduleName={selectedIntegration}
          moduleDisplayName={selectedIntegration.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Integration Management</h2>
        <p className="text-gray-600">
          Manage integration modules and their configurations for the selected tenant.
        </p>
      </div>

      <Tabs defaultValue="enablement" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="enablement">Module Enablement</TabsTrigger>
          <TabsTrigger value="connections">Active Connections</TabsTrigger>
        </TabsList>

        <TabsContent value="enablement" className="mt-6">
          {selectedTenant && (
            <ModuleEnablementManager
              tenantId={selectedTenantId}
              tenantName={selectedTenant.name}
            />
          )}
        </TabsContent>

        <TabsContent value="connections" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Module Connections</CardTitle>
              <CardDescription>
                Configure and manage connections for enabled integration modules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">
                  Select a module from the Enablement tab to configure its connections
                </p>
                <Button 
                  variant="outline"
                  onClick={() => setCurrentView('overview')}
                >
                  View Module Enablement
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegrationsTabContent;
