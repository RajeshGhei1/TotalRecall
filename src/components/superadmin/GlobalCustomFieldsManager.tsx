
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CustomFieldsManager } from '@/components/customFields';

const GlobalCustomFieldsManager: React.FC = () => {
  console.log("Rendering GlobalCustomFieldsManager");
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Global Custom Fields for Tenants</CardTitle>
        <CardDescription>
          Define custom fields that will be available for all tenants. You can specify which forms these fields should appear in.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-6">
          These fields will be available based on the form context you select. Fields with no form selection will appear in all forms.
        </p>
        <CustomFieldsManager tenantId="global" />
      </CardContent>
    </Card>
  );
};

export default GlobalCustomFieldsManager;
