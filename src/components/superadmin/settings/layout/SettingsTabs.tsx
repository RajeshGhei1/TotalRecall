
import React, { ReactNode } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Blocks, Globe, FileText } from 'lucide-react';
import TenantContextIndicator from '../shared/TenantContextIndicator';

interface SettingsTabsProps {
  children: ReactNode;
}

const SettingsTabs: React.FC<SettingsTabsProps> = ({ children }) => {
  return (
    <Tabs defaultValue="modules" className="w-full">
      <div className="border-b mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <TabsList className="w-full lg:w-auto justify-start overflow-x-auto bg-transparent px-0 py-0 h-14">
            <TabsTrigger value="modules" className="flex items-center gap-2 h-12 px-6">
              <Blocks className="h-4 w-4" />
              <span>Modules</span>
            </TabsTrigger>
            <TabsTrigger value="forms" className="flex items-center gap-2 h-12 px-6">
              <FileText className="h-4 w-4" />
              <span>Forms & Templates</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2 h-12 px-6">
              <Globe className="h-4 w-4" />
              <span>Integrations</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Tenant Context Indicator in Tab Bar */}
          <TenantContextIndicator showInHeader={true} className="lg:flex hidden" />
        </div>
      </div>
      
      {children}
    </Tabs>
  );
};

export default SettingsTabs;
