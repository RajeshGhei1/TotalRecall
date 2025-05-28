
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Blocks, Settings as SettingsIcon, Bot } from 'lucide-react';
import GlobalCustomFieldsManager from '../../GlobalCustomFieldsManager';
import DropdownOptionsManager from '../../dropdown-manager/DropdownOptionsManager';
import AIModelIntegration from '../../AIModelIntegration';
import ModuleRegistry from '../ModuleRegistry';
import TenantContextIndicator from '../shared/TenantContextIndicator';

const ModulesTabContent: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Module Registry - Main Feature */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Blocks className="h-5 w-5" />
                Module Management
              </CardTitle>
              <CardDescription>
                Manage system modules and assign them to tenants
              </CardDescription>
            </div>
            <TenantContextIndicator className="lg:hidden" />
          </div>
        </CardHeader>
        <CardContent>
          <ModuleRegistry />
        </CardContent>
      </Card>

      {/* Configuration Tools */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <SettingsIcon className="h-4 w-4" />
              Custom Fields
            </CardTitle>
            <CardDescription className="text-sm">
              Define global custom fields for all tenants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GlobalCustomFieldsManager />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <SettingsIcon className="h-4 w-4" />
              Dropdown Options
            </CardTitle>
            <CardDescription className="text-sm">
              Manage dropdown options across the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DropdownOptionsManager />
          </CardContent>
        </Card>
      </div>

      {/* AI Models */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Model Configuration
          </CardTitle>
          <CardDescription>
            Configure AI models available to tenants
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AIModelIntegration />
        </CardContent>
      </Card>
    </div>
  );
};

export default ModulesTabContent;
