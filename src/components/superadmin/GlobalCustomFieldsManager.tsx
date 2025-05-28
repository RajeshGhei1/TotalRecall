
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CustomFieldsManager } from '@/components/customFields';
import { AlertCircle } from 'lucide-react';
import { useTenantContext } from '@/contexts/TenantContext';
import TenantContextIndicator from './settings/shared/TenantContextIndicator';

const GlobalCustomFieldsManager: React.FC = () => {
  console.log("Rendering GlobalCustomFieldsManager");
  const { selectedTenantId } = useTenantContext();
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Custom Fields Configuration</h3>
          <p className="text-sm text-muted-foreground">
            {selectedTenantId ? 
              "Configure custom fields for the selected tenant" : 
              "Configure global custom fields for all tenants"
            }
          </p>
        </div>
        {selectedTenantId && <TenantContextIndicator />}
      </div>

      {selectedTenantId ? (
        <Card>
          <CardHeader>
            <CardTitle>Tenant-Specific Custom Fields</CardTitle>
            <CardDescription>
              Define custom fields that will be available for this specific tenant. These fields will appear in relevant forms based on the context you select.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CustomFieldsManager tenantId={selectedTenantId} />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Global Custom Fields for Tenants</CardTitle>
            <CardDescription>
              Define custom fields that will be available for all tenants. You can specify which forms these fields should appear in.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 border border-amber-200 bg-amber-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="font-medium text-amber-900">Global Configuration Mode</p>
                  <p className="text-sm text-amber-700">
                    You're configuring global fields. Select a tenant above for tenant-specific configuration.
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground mb-6">
                These fields will be available based on the form context you select. Fields with no form selection will appear in all forms.
              </p>
              <CustomFieldsManager tenantId="global" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GlobalCustomFieldsManager;
