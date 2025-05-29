
import React from 'react';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import ModuleRegistry from '@/components/superadmin/settings/ModuleRegistry';

const ModulesTabContent = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Module Management</h2>
        <p className="text-gray-600">
          Configure and manage system modules, assign modules to tenants, and control module permissions.
        </p>
      </div>

      <ErrorBoundary>
        <ModuleRegistry />
      </ErrorBoundary>
    </div>
  );
};

export default ModulesTabContent;
