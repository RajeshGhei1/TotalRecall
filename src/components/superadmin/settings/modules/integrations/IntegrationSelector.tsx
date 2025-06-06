
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight,
  Linkedin,
  Facebook,
  Mail,
  MessageCircle,
  Video,
  DollarSign,
  Globe
} from 'lucide-react';

interface IntegrationOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  status: 'available' | 'connected' | 'coming_soon';
}

interface IntegrationSelectorProps {
  moduleName: string;
  onSelectIntegration: (integrationId: string) => void;
}

const getIntegrationsForModule = (moduleName: string): IntegrationOption[] => {
  const moduleIntegrations: Record<string, IntegrationOption[]> = {
    social_media_integration: [
      {
        id: 'linkedin',
        name: 'LinkedIn',
        description: 'Connect with LinkedIn for professional networking and recruiting',
        icon: <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center"><span className="text-white font-bold text-xs">in</span></div>,
        category: 'Professional',
        status: 'available'
      },
      {
        id: 'facebook',
        name: 'Facebook',
        description: 'Integrate with Facebook for marketing and lead generation',
        icon: <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center"><span className="text-white font-bold text-xs">f</span></div>,
        category: 'Social',
        status: 'available'
      },
      {
        id: 'twitter',
        name: 'Twitter/X',
        description: 'Connect with Twitter for social media engagement',
        icon: <div className="w-6 h-6 bg-black rounded flex items-center justify-center"><span className="text-white font-bold text-xs">X</span></div>,
        category: 'Social',
        status: 'coming_soon'
      }
    ],
    communication_platforms: [
      {
        id: 'slack',
        name: 'Slack',
        description: 'Integrate with Slack for team communication',
        icon: <MessageCircle className="w-6 h-6 text-purple-600" />,
        category: 'Messaging',
        status: 'coming_soon'
      },
      {
        id: 'teams',
        name: 'Microsoft Teams',
        description: 'Connect with Teams for enterprise communication',
        icon: <MessageCircle className="w-6 h-6 text-blue-600" />,
        category: 'Messaging',
        status: 'coming_soon'
      }
    ],
    video_conferencing: [
      {
        id: 'zoom',
        name: 'Zoom',
        description: 'Integrate with Zoom for video meetings',
        icon: <Video className="w-6 h-6 text-blue-500" />,
        category: 'Video',
        status: 'coming_soon'
      },
      {
        id: 'meet',
        name: 'Google Meet',
        description: 'Connect with Google Meet for video calls',
        icon: <Video className="w-6 h-6 text-green-500" />,
        category: 'Video',
        status: 'coming_soon'
      }
    ],
    billing_integrations: [
      {
        id: 'stripe',
        name: 'Stripe',
        description: 'Integrate with Stripe for payment processing',
        icon: <DollarSign className="w-6 h-6 text-purple-600" />,
        category: 'Payments',
        status: 'coming_soon'
      },
      {
        id: 'paypal',
        name: 'PayPal',
        description: 'Connect with PayPal for payment processing',
        icon: <DollarSign className="w-6 h-6 text-blue-600" />,
        category: 'Payments',
        status: 'coming_soon'
      }
    ],
    api_connectors: [
      {
        id: 'webhook',
        name: 'Custom Webhook',
        description: 'Set up custom webhook integrations',
        icon: <Globe className="w-6 h-6 text-gray-600" />,
        category: 'Custom',
        status: 'coming_soon'
      },
      {
        id: 'rest_api',
        name: 'REST API',
        description: 'Connect to custom REST APIs',
        icon: <Globe className="w-6 h-6 text-blue-600" />,
        category: 'Custom',
        status: 'coming_soon'
      }
    ]
  };

  return moduleIntegrations[moduleName] || [];
};

export const IntegrationSelector: React.FC<IntegrationSelectorProps> = ({ 
  moduleName, 
  onSelectIntegration 
}) => {
  const integrations = getIntegrationsForModule(moduleName);

  if (integrations.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Globe className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No integrations available for this module yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Available Integrations</h3>
        <p className="text-gray-600">
          Select an integration to configure for this module.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((integration) => (
          <Card key={integration.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {integration.icon}
                  <div>
                    <CardTitle className="text-base">{integration.name}</CardTitle>
                    <Badge variant="outline" className="text-xs mt-1">
                      {integration.category}
                    </Badge>
                  </div>
                </div>
                <Badge 
                  variant={
                    integration.status === 'available' ? 'default' : 
                    integration.status === 'connected' ? 'default' : 
                    'secondary'
                  }
                >
                  {integration.status === 'available' ? 'Available' :
                   integration.status === 'connected' ? 'Connected' :
                   'Coming Soon'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                {integration.description}
              </CardDescription>
              <Button 
                onClick={() => onSelectIntegration(integration.id)}
                disabled={integration.status === 'coming_soon'}
                className="w-full"
                variant={integration.status === 'connected' ? 'outline' : 'default'}
              >
                {integration.status === 'connected' ? 'Manage' : 'Configure'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default IntegrationSelector;
