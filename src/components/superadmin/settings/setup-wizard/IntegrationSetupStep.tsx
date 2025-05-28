
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, MessageCircle, Database } from 'lucide-react';

interface IntegrationSetupStepProps {
  settings: Record<string, any>;
  onUpdate: (settings: Record<string, any>) => void;
}

const IntegrationSetupStep: React.FC<IntegrationSetupStepProps> = ({ settings, onUpdate }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Integration Setup</h3>
        <p className="text-sm text-muted-foreground">
          Configure external integrations and connections
        </p>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="h-4 w-4" />
              Social Media Integrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Social media connections will be configured in the next steps
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageCircle className="h-4 w-4" />
              Communication Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Email and messaging configurations will be set up
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Database className="h-4 w-4" />
              API Integrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              External API connections and webhooks will be configured
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IntegrationSetupStep;
