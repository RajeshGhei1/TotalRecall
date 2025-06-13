
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTenantContext } from '@/contexts/TenantContext';
import GlobalTenantSelector from '../shared/GlobalTenantSelector';
import FormDefinitionsList from '../forms/FormDefinitionsList';
import EmailTemplatesManager from '../forms/EmailTemplatesManager';

const FormsTabContent: React.FC = () => {
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
        <div className="space-y-6">
          <FormDefinitionsList tenantId={selectedTenantId} />
          <EmailTemplatesManager tenantId={selectedTenantId} />
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <h3 className="text-lg font-medium mb-2">Select a Tenant</h3>
            <p className="text-muted-foreground">
              Choose a tenant above to manage their forms and templates
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FormsTabContent;
