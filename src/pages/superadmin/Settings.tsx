
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GlobalCustomFieldsManager from '@/components/superadmin/GlobalCustomFieldsManager';
import DropdownOptionsManager from '@/components/superadmin/DropdownOptionsManager';

const Settings = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">System Settings</h1>
        
        <Tabs defaultValue="dropdown-options" className="space-y-6">
          <TabsList>
            <TabsTrigger value="dropdown-options">Dropdown Options</TabsTrigger>
            <TabsTrigger value="custom-fields">Custom Fields</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dropdown-options">
            <DropdownOptionsManager />
          </TabsContent>
          
          <TabsContent value="custom-fields">
            <GlobalCustomFieldsManager />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Settings;
