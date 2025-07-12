
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Database, Bot } from 'lucide-react';

interface CustomConfigurationStepProps {
  config: Record<string, unknown>;
  onUpdate: (config: Record<string, unknown>) => void;
}

const CustomConfigurationStep: React.FC<CustomConfigurationStepProps> = ({ config, onUpdate }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Custom Configuration</h3>
        <p className="text-sm text-muted-foreground">
          Set up custom fields, dropdown options, and AI models
        </p>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="h-4 w-4" />
              Custom Fields
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Custom field definitions will be available after setup completion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Database className="h-4 w-4" />
              Dropdown Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Dropdown categories and options will be configured
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bot className="h-4 w-4" />
              AI Model Assignment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              AI models will be assigned based on selected modules
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomConfigurationStep;
