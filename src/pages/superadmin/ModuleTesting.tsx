
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import ModuleTestPage from '@/components/modules/ModuleTestPage';
import { ErrorBoundary } from '@/components/ui/error-boundary';

const ModuleTesting = () => {
  return (
    <AdminLayout>
      <ErrorBoundary>
        <ModuleTestPage />
      </ErrorBoundary>
    </AdminLayout>
  );
};

export default ModuleTesting;
