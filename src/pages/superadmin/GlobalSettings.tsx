
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import SystemTabContent from '@/components/superadmin/settings/tabs/SystemTabContent';

const GlobalSettings = () => {
  console.log("Rendering SuperAdmin Global Settings Page");
  
  return (
    <ErrorBoundary>
      <AdminLayout>
        <div className="p-6">
          <SystemTabContent />
        </div>
      </AdminLayout>
    </ErrorBoundary>
  );
};

export default GlobalSettings;
