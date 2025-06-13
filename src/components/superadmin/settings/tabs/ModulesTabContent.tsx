
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTenantContext } from '@/contexts/TenantContext';
import TenantModuleManager from '../modules/TenantModuleManager';
import GlobalTenantSelector from '../shared/GlobalTenantSelector';

const ModulesTabContent: React.FC = () => {
  const { selectedTenantId } = useTenantContext();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tenant Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <GlobalTenantSelector />
        </CardContent>
      </Card>

      {selectedTenantId ? (
        <TenantModuleManager />
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <h3 className="text-lg font-medium mb-2">Select a Tenant</h3>
            <p className="text-muted-foreground">
              Choose a tenant above to manage their module configurations
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ModulesTabContent;
