
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  FileText, 
  Link 
} from 'lucide-react';

interface SettingsTabsProps {
  children: React.ReactNode;
}

const SettingsTabs: React.FC<SettingsTabsProps> = ({ children }) => {
  return (
    <Tabs defaultValue="modules" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="modules" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Modules
        </TabsTrigger>
        <TabsTrigger value="forms" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Forms
        </TabsTrigger>
        <TabsTrigger value="integrations" className="flex items-center gap-2">
          <Link className="h-4 w-4" />
          Integrations
        </TabsTrigger>
      </TabsList>
      
      {children}
    </Tabs>
  );
};

export default SettingsTabs;
