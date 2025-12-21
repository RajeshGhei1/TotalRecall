
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import ModuleDevSandbox from '@/components/modules/ModuleDevSandbox';
import { ErrorBoundary } from '@/components/ui/error-boundary';

const ModuleDevelopment = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">App Development</h1>
          <p className="text-gray-600 mt-2">
            Isolated development environment for building and testing app components
          </p>
        </div>

        <ErrorBoundary>
          <ModuleDevSandbox />
        </ErrorBoundary>
      </div>
    </AdminLayout>
  );
};

export default ModuleDevelopment;
