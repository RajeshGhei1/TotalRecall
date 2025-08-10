import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import FeatureDevelopmentLab from '@/components/features/FeatureDevelopmentLab';
import { ErrorBoundary } from '@/components/ui/error-boundary';

const FeatureDevelopment = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <ErrorBoundary>
          <FeatureDevelopmentLab />
        </ErrorBoundary>
      </div>
    </AdminLayout>
  );
};

export default FeatureDevelopment; 