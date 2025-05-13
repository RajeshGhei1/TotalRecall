
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GlobalCustomFieldsManager from '@/components/superadmin/GlobalCustomFieldsManager';
import DropdownOptionsManager from '@/components/superadmin/DropdownOptionsManager';
import AIModelIntegration from '@/components/superadmin/AIModelIntegration';
import { Database, Bot, ListFilter } from 'lucide-react';

const Settings = () => {
  console.log("Rendering SuperAdmin Settings Page");
  
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">System Settings</h1>
        
        <Tabs defaultValue="dropdown-options" className="space-y-6">
          <TabsList className="mb-4">
            <TabsTrigger value="dropdown-options" className="flex items-center gap-1">
              <ListFilter className="h-4 w-4" />
              Dropdown Options
            </TabsTrigger>
            <TabsTrigger value="custom-fields" className="flex items-center gap-1">
              <Database className="h-4 w-4" />
              Custom Fields
            </TabsTrigger>
            <TabsTrigger value="ai-models" className="flex items-center gap-1">
              <Bot className="h-4 w-4" />
              AI Models
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dropdown-options" className="mt-6">
            <DropdownOptionsManager />
          </TabsContent>
          
          <TabsContent value="custom-fields" className="mt-6">
            <GlobalCustomFieldsManager />
          </TabsContent>
          
          <TabsContent value="ai-models" className="mt-6">
            <AIModelIntegration />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Settings;
