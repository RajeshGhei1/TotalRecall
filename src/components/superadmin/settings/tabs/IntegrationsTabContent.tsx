
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTenantContext } from '@/contexts/TenantContext';
import GlobalTenantSelector from '../shared/GlobalTenantSelector';
import { Globe, Link, Database, MessageSquare } from 'lucide-react';

const IntegrationsTabContent: React.FC = () => {
  const { selectedTenantId } = useTenantContext();

  const integrations = [
    {
      id: 'linkedin',
      name: 'LinkedIn',
      description: 'Connect LinkedIn for talent sourcing and outreach',
      icon: Link,
      status: 'available'
    },
    {
      id: 'email',
      name: 'Email Service',
      description: 'Configure SMTP settings for automated emails',
      icon: MessageSquare,
      status: 'available'
    },
    {
      id: 'api',
      name: 'External APIs',
      description: 'Manage third-party API connections',
      icon: Database,
      status: 'available'
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tenant Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <GlobalTenantSelector />
        </CardContent>
      </Card>

      {selectedTenantId ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Available Integrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {integrations.map((integration) => (
                <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <integration.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{integration.name}</h3>
                      <p className="text-sm text-muted-foreground">{integration.description}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                    {integration.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <h3 className="text-lg font-medium mb-2">Select a Tenant</h3>
            <p className="text-muted-foreground">
              Choose a tenant above to manage their integrations
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default IntegrationsTabContent;
