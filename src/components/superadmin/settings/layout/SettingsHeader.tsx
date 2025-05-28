
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2 } from 'lucide-react';
import GlobalTenantSelector from '../shared/GlobalTenantSelector';

const SettingsHeader: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 mb-8">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-lg text-gray-600 mt-2">
            Manage platform modules, tenant configurations, and system-wide settings
          </p>
        </div>
      </div>

      {/* Global Tenant Context Selector */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            Tenant Configuration Context
          </CardTitle>
          <CardDescription>
            Select a tenant to configure its modules, settings, and integrations. All configuration tabs will operate within this tenant context.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GlobalTenantSelector />
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsHeader;
