
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Link,
  Database
} from 'lucide-react';

interface SettingsTabsProps {
  children: React.ReactNode;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

const SettingsTabs: React.FC<SettingsTabsProps> = ({ 
  children, 
  defaultValue = 'modules',
  value,
  onValueChange
}) => {
  // Use controlled mode if value and onValueChange are provided, otherwise use uncontrolled mode
  const tabsProps = value !== undefined && onValueChange !== undefined
    ? { value, onValueChange }
    : { defaultValue };

  return (
    <Tabs {...tabsProps} className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="modules" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Modules
        </TabsTrigger>
        <TabsTrigger value="custom-fields" className="flex items-center gap-2">
          <Database className="h-4 w-4" />
          Custom Fields
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
