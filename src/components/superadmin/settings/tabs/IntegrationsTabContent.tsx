
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, MessageCircle, Send, Cog } from 'lucide-react';
import SocialMediaSettings from '../SocialMediaSettings';
import CommunicationSettings from '../CommunicationSettings';
import OutreachSettings from '../OutreachSettings';
import ApiSettings from '../ApiSettings';

const IntegrationsTabContent: React.FC = () => {
  return (
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
  );
};

export default IntegrationsTabContent;
