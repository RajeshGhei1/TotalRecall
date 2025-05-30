
import React from 'react';
import { UnifiedModuleAccessGuard } from '@/components/access-control/UnifiedModuleAccessGuard';
import TalentAnalyticsDashboard from './TalentAnalyticsDashboard';

const SmartTalentAnalyticsModule: React.FC = () => {
  return (
    <UnifiedModuleAccessGuard 
      moduleName="smart_talent_analytics"
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
