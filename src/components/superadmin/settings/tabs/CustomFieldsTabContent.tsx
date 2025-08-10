import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Globe } from 'lucide-react';
import GlobalCustomFieldsManager from '@/components/superadmin/GlobalCustomFieldsManager';

const CustomFieldsTabContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-blue-600" />
            Global Custom Fields
          </CardTitle>
          <CardDescription>
            Create and manage global custom fields that will be available to all tenants across their modules.
            These fields will automatically appear in Form Builder, Report Builder, and Dashboard Builder for all tenants.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 border border-blue-200 bg-blue-50 rounded-lg">
              <Globe className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">Super Admin Global Fields</p>
                <p className="text-sm text-blue-700">
                  Fields created here will be available to all tenants and marked with a "Global" badge.
                  Tenants can also create their own tenant-specific custom fields.
                </p>
              </div>
            </div>
            
            <GlobalCustomFieldsManager />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomFieldsTabContent; 