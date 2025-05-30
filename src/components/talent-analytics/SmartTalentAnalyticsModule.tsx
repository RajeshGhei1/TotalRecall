
import React from 'react';
import UnifiedModuleAccessGuard from '@/components/access-control/UnifiedModuleAccessGuard';
import TalentAnalyticsDashboard from './TalentAnalyticsDashboard';
import { useTenantContext } from '@/contexts/TenantContext';

const SmartTalentAnalyticsModule: React.FC = () => {
  const { selectedTenantId } = useTenantContext();

  return (
    <UnifiedModuleAccessGuard 
      moduleName="smart_talent_analytics"
      tenantId={selectedTenantId}
      fallback={
        <div className="p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Smart Talent Analytics</h2>
          <p className="text-muted-foreground">
            This module requires the Smart Talent Analytics subscription to access AI-powered talent insights.
          </p>
        </div>
      }
    >
      <TalentAnalyticsDashboard />
    </UnifiedModuleAccessGuard>
  );
};

export default SmartTalentAnalyticsModule;
