import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import UnifiedFeatureManagement from '@/components/features/UnifiedFeatureManagement';
import { ErrorBoundary } from '@/components/ui/error-boundary';

const FeatureManagement = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <ErrorBoundary>
          <UnifiedFeatureManagement />
        </ErrorBoundary>
      </div>
    </AdminLayout>
  );
};

export default FeatureManagement; 