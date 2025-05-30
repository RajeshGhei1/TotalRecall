
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import SmartTalentAnalyticsModule from '@/components/talent-analytics/SmartTalentAnalyticsModule';

const SmartTalentAnalytics = () => {
  return (
    <ErrorBoundary>
      <AdminLayout>
        <SmartTalentAnalyticsModule />
      </AdminLayout>
    </ErrorBoundary>
  );
};

export default SmartTalentAnalytics;
