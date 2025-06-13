
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Plus,
  Mail,
  Layout
} from 'lucide-react';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { useTenantContext } from '@/contexts/TenantContext';
import FormDefinitionsList from '../forms/FormDefinitionsList';
import EmailTemplatesManager from '../forms/EmailTemplatesManager';
import FormBuilderDialog from '../forms/FormBuilderDialog';

const FormsTabContent: React.FC = () => {
  const { selectedTenantId } = useTenantContext();
  const [formBuilderOpen, setFormBuilderOpen] = useState(false);

  if (!selectedTenantId) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Please select a tenant to manage forms and templates</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Forms & Templates</h2>
        <p className="text-gray-600">
          Create and manage form definitions, email templates, and document templates for the selected tenant.
        </p>
      </div>

      <Tabs defaultValue="forms" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="forms" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Forms
            </TabsTrigger>
            <TabsTrigger value="email-templates" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Templates
            </TabsTrigger>
            <TabsTrigger value="document-templates" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documents
            </TabsTrigger>
          </TabsList>

          <Button onClick={() => setFormBuilderOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Form
          </Button>
        </div>

        <TabsContent value="forms" className="mt-6">
          <ErrorBoundary>
            <FormDefinitionsList tenantId={selectedTenantId} />
          </ErrorBoundary>
        </TabsContent>

        <TabsContent value="email-templates" className="mt-6">
          <ErrorBoundary>
            <EmailTemplatesManager tenantId={selectedTenantId} />
          </ErrorBoundary>
        </TabsContent>

        <TabsContent value="document-templates" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Document Templates</CardTitle>
              <CardDescription>
                Manage document templates for contracts, offer letters, and other documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">Document template management coming soon</p>
                <Button variant="outline" disabled>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Form Builder Dialog */}
      <FormBuilderDialog
        open={formBuilderOpen}
        onOpenChange={setFormBuilderOpen}
        tenantId={selectedTenantId}
      />
    </div>
  );
};

export default FormsTabContent;
