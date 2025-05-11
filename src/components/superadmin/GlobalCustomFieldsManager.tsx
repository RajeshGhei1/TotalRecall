
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomFieldsManager } from '@/components/customFields';

const GlobalCustomFieldsManager: React.FC = () => {
  console.log("Rendering GlobalCustomFieldsManager");
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Global Custom Fields for Tenants</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-6">
          Define custom fields that will be available for all tenants. These fields will appear in the tenant creation and edit forms.
        </p>
        <CustomFieldsManager tenantId="global" />
      </CardContent>
    </Card>
  );
};

export default GlobalCustomFieldsManager;
