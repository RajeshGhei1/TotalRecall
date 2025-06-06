
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ExternalLink,
  Users,
  MessageSquare,
  BarChart3,
  Settings
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  status: 'available' | 'coming_soon' | 'beta';
  features: string[];
}

interface IntegrationSelectorProps {
  moduleName: string;
  onSelectIntegration: (integrationId: string) => void;
}

export const IntegrationSelector: React.FC<IntegrationSelectorProps> = ({
  moduleName,
  onSelectIntegration
}) => {
  const integrations: Integration[] = [
    {
      id: 'linkedin',
      name: 'LinkedIn',
      description: 'Professional networking platform integration for profile matching and data enrichment',
      icon: <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
        <span className="text-white font-bold text-sm">in</span>
      </div>,
      category: 'Social Media',
      status: 'available',
      features: [
        'Profile matching by email',
        'Bulk contact enrichment',
        'Professional data sync',
        'Company page management',
        'Content posting'
      ]
    },
    {
      id: 'facebook',
      name: 'Facebook',
      description: 'Social media platform integration for broader audience engagement',
      icon: <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
        <span className="text-white font-bold text-sm">f</span>
      </div>,
      category: 'Social Media',
      status: 'available',
      features: [
        'Page management',
        'Content publishing',
        'Audience insights',
        'Lead generation'
      ]
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      description: 'Social media platform for real-time engagement and content distribution',
      icon: <MessageSquare className="w-8 h-8 text-gray-700" />,
      category: 'Social Media',
      status: 'coming_soon',
      features: [
        'Tweet publishing',
        'Engagement tracking',
        'Hashtag analytics',
        'Follower management'
      ]
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      description: 'CRM integration for comprehensive customer relationship management',
      icon: <Users className="w-8 h-8 text-blue-400" />,
      category: 'CRM',
      status: 'coming_soon',
      features: [
        'Contact synchronization',
        'Lead management',
        'Opportunity tracking',
        'Custom field mapping'
      ]
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      description: 'Marketing automation and CRM platform integration',
      icon: <BarChart3 className="w-8 h-8 text-orange-500" />,
      category: 'Marketing',
      status: 'beta',
      features: [
        'Marketing automation',
        'Contact management',
        'Email campaigns',
        'Analytics reporting'
      ]
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Available</Badge>;
      case 'beta':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Beta</Badge>;
      case 'coming_soon':
        return <Badge variant="secondary">Coming Soon</Badge>;
      default:
        return null;
    }
  };

  const handleSelectIntegration = (integrationId: string, status: string) => {
    if (status === 'available' || status === 'beta') {
      onSelectIntegration(integrationId);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Available Integrations</h3>
        <p className="text-sm text-gray-600">
          Select an integration to configure for the {moduleName.replace(/_/g, ' ')} module
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((integration) => (
          <Card 
            key={integration.id}
            className={`transition-all hover:shadow-md ${
              integration.status === 'available' || integration.status === 'beta' 
                ? 'cursor-pointer hover:ring-2 hover:ring-blue-500' 
                : 'opacity-75'
            }`}
            onClick={() => handleSelectIntegration(integration.id, integration.status)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                {integration.icon}
                {getStatusBadge(integration.status)}
              </div>
              <CardTitle className="text-lg">{integration.name}</CardTitle>
              <CardDescription className="text-sm">
                {integration.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Badge variant="outline" className="text-xs">
                    {integration.category}
                  </Badge>
                </div>
                
                <div>
                  <h5 className="font-medium text-sm mb-2">Key Features:</h5>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {integration.features.slice(0, 3).map((feature, index) => (
                      <li key={index}>• {feature}</li>
                    ))}
                    {integration.features.length > 3 && (
                      <li className="text-gray-500">+ {integration.features.length - 3} more</li>
                    )}
                  </ul>
                </div>

                <Button 
                  variant={integration.status === 'available' ? 'default' : 'outline'}
                  size="sm" 
                  className="w-full"
                  disabled={integration.status === 'coming_soon'}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectIntegration(integration.id, integration.status);
                  }}
                >
                  {integration.status === 'coming_soon' ? (
                    'Coming Soon'
                  ) : integration.status === 'beta' ? (
                    <>
                      <Settings className="w-4 h-4 mr-1" />
                      Configure (Beta)
                    </>
                  ) : (
                    <>
                      <Settings className="w-4 h-4 mr-1" />
                      Configure
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <ExternalLink className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h6 className="font-medium text-blue-900">Integration Support</h6>
            <p className="text-sm text-blue-800 mt-1">
              Need help with integration setup? Check our documentation or contact support for assistance 
              with API configurations and best practices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationSelector;
