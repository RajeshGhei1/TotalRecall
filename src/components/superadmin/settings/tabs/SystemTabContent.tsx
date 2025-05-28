
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon } from 'lucide-react';
import GeneralSettings from '../GeneralSettings';

const SystemTabContent: React.FC = () => {
  return (
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
  );
};

export default SystemTabContent;
