
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Database, Settings, LayoutTemplate } from 'lucide-react';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import GlobalCustomFieldsManager from '@/components/superadmin/GlobalCustomFieldsManager';
import DropdownOptionsManager from '@/components/superadmin/dropdown-manager/DropdownOptionsManager';
import FormsManager from '@/components/forms/FormsManager';

const FormsTabContent = () => {
  const [activeSubTab, setActiveSubTab] = useState('form-builder');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Forms & Templates Management</h2>
        <p className="text-gray-600">
          Create and manage forms, custom fields, dropdown options, and templates for your organization.
        </p>
      </div>

      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="form-builder" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Form Builder</span>
          </TabsTrigger>
          <TabsTrigger value="custom-fields" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Custom Fields</span>
          </TabsTrigger>
          <TabsTrigger value="dropdown-options" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Dropdown Options</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <LayoutTemplate className="h-4 w-4" />
            <span className="hidden sm:inline">Templates</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="form-builder" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Form Builder
              </CardTitle>
              <CardDescription>
                Create and design dynamic forms with drag-and-drop functionality. Build forms that can be used across different modules.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ErrorBoundary>
                <FormsManager />
              </ErrorBoundary>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom-fields" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Custom Fields Management
              </CardTitle>
              <CardDescription>
                Create and manage custom fields that can be used in forms and throughout the application. These fields extend the default data structure.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ErrorBoundary>
                <GlobalCustomFieldsManager />
              </ErrorBoundary>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dropdown-options" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Dropdown Options Management
              </CardTitle>
              <CardDescription>
                Manage dropdown categories and options that are used across forms and custom fields. Create centralized option lists for consistent data entry.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ErrorBoundary>
                <DropdownOptionsManager />
              </ErrorBoundary>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LayoutTemplate className="h-5 w-5" />
                Form Templates
              </CardTitle>
              <CardDescription>
                Create and manage reusable form templates for common use cases like job applications, employee onboarding, or client intake forms.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <LayoutTemplate className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Templates Coming Soon</h3>
                <p>Form templates functionality will be available in a future update.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FormsTabContent;
