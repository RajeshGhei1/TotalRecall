
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Zap,
  MessageSquare,
  Video,
  Mail,
  Megaphone,
  FileText,
  CreditCard,
  Link,
  Settings,
  Plus
} from 'lucide-react';
import { useSystemModules } from '@/hooks/modules/useSystemModules';
import { useTenantModules } from '@/hooks/modules/useTenantModules';
import { useTenantContext } from '@/contexts/TenantContext';
import { ModuleConnectionManager } from '../modules/ModuleConnectionManager';

const IntegrationsTabContent = () => {
  const { selectedTenantId } = useTenantContext();
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  
  const { data: systemModules, isLoading: modulesLoading } = useSystemModules();
  const { data: tenantModules, isLoading: tenantModulesLoading } = useTenantModules(selectedTenantId || undefined);

  // Filter integration-related modules
  const integrationModules = systemModules?.filter(module => 
    ['marketing', 'communication', 'finance', 'integrations'].includes(module.category)
  ) || [];

  const getModuleIcon = (moduleName: string) => {
    const iconMap: Record<string, any> = {
      'social_media_integration': Megaphone,
      'communication_platforms': MessageSquare,
      'video_conferencing': Video,
      'email_automation': Mail,
      'outreach_automation': Zap,
      'document_parsing': FileText,
      'billing_integrations': CreditCard,
      'api_connectors': Link
    };
    return iconMap[moduleName] || Settings;
  };

  const getModuleColor = (category: string) => {
    const colorMap: Record<string, string> = {
      'marketing': 'bg-purple-100 text-purple-700',
      'communication': 'bg-blue-100 text-blue-700',
      'finance': 'bg-green-100 text-green-700',
      'integrations': 'bg-orange-100 text-orange-700',
      'ai_tools': 'bg-indigo-100 text-indigo-700'
    };
    return colorMap[category] || 'bg-gray-100 text-gray-700';
  };

  const isModuleEnabled = (moduleName: string) => {
    return tenantModules?.some(tm => 
      tm.module?.name === moduleName && tm.is_enabled
    );
  };

  if (modulesLoading || tenantModulesLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (selectedIntegration) {
    const module = integrationModules.find(m => m.name === selectedIntegration);
    if (!module) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setSelectedIntegration(null)}
          >
            ← Back to Integrations
          </Button>
        </div>
        
        <ModuleConnectionManager
          moduleName={module.name}
          moduleDisplayName={module.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Integration Modules</h2>
        <p className="text-gray-600">
          Manage platform integrations and external service connections for tenants.
        </p>
      </div>

      {!selectedTenantId && (
        <Card>
          <CardContent className="text-center py-8">
            <Settings className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Please select a tenant to manage integrations</p>
          </CardContent>
        </Card>
      )}

      {selectedTenantId && (
        <Tabs defaultValue="available" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="available">Available Modules</TabsTrigger>
            <TabsTrigger value="enabled">Enabled Modules</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {integrationModules.map((module) => {
                const IconComponent = getModuleIcon(module.name);
                const enabled = isModuleEnabled(module.name);
                
                return (
                  <Card 
                    key={module.id} 
                    className={`cursor-pointer transition-colors hover:shadow-md ${
                      enabled ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => enabled && setSelectedIntegration(module.name)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className={`p-2 rounded-lg ${getModuleColor(module.category)}`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={module.is_active ? 'default' : 'secondary'}>
                            {module.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          {enabled && (
                            <Badge className="bg-blue-100 text-blue-700">
                              Enabled
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardTitle className="text-lg">
                        {module.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {module.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {module.category}
                        </Badge>
                        {enabled ? (
                          <Button size="sm" variant="outline">
                            <Settings className="h-4 w-4 mr-1" />
                            Configure
                          </Button>
                        ) : (
                          <Button size="sm" disabled variant="outline">
                            <Plus className="h-4 w-4 mr-1" />
                            Enable Module
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="enabled" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {integrationModules
                .filter(module => isModuleEnabled(module.name))
                .map((module) => {
                  const IconComponent = getModuleIcon(module.name);
                  
                  return (
                    <Card 
                      key={module.id}
                      className="cursor-pointer transition-colors hover:shadow-md"
                      onClick={() => setSelectedIntegration(module.name)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className={`p-2 rounded-lg ${getModuleColor(module.category)}`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <Badge className="bg-green-100 text-green-700">
                            Enabled
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">
                          {module.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {module.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button size="sm" className="w-full">
                          <Settings className="h-4 w-4 mr-2" />
                          Manage Connections
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>

            {integrationModules.filter(module => isModuleEnabled(module.name)).length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <Zap className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">No integration modules enabled</p>
                  <p className="text-sm text-gray-500">
                    Enable modules from the Available Modules tab to start configuring integrations
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default IntegrationsTabContent;
