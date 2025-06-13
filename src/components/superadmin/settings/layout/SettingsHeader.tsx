
import React from 'react';
import { Settings } from 'lucide-react';
import TenantContextIndicator from '../shared/TenantContextIndicator';

const SettingsHeader: React.FC = () => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Settings className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tenant Settings</h1>
            <p className="text-muted-foreground">
              Configure modules, forms, templates, and integrations for tenants
            </p>
          </div>
        </div>
      </div>
      
      {/* Mobile Tenant Context Indicator */}
      <TenantContextIndicator showInHeader={false} className="lg:hidden" />
    </div>
  );
};

export default SettingsHeader;
