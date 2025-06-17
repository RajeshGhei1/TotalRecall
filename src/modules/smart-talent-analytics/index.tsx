
import React from 'react';
import SmartTalentAnalyticsModule from '@/components/talent-analytics/SmartTalentAnalyticsModule';

interface SmartTalentAnalyticsProps {
  mode?: 'dashboard' | 'insights' | 'patterns' | 'predictions';
  showMetrics?: boolean;
  enableRealTime?: boolean;
}

const SmartTalentAnalytics: React.FC<SmartTalentAnalyticsProps> = ({
  mode = 'dashboard',
  showMetrics = true,
  enableRealTime = true
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Smart Talent Analytics</h1>
        <div className="text-sm text-muted-foreground">
          AI-powered talent insights and analytics
        </div>
      </div>
      
      <SmartTalentAnalyticsModule />
    </div>
  );
};

// Module metadata for registration
(SmartTalentAnalytics as any).moduleMetadata = {
  id: 'smart-talent-analytics',
  name: 'Smart Talent Analytics',
  category: 'analytics',
  version: '1.0.0',
  description: 'AI-powered talent analytics with predictive insights, pattern analysis, and talent matching',
  author: 'System',
  requiredPermissions: ['read', 'analytics_access'],
  dependencies: ['ats-core', 'talent-database'],
  props: {
    mode: { type: 'string', options: ['dashboard', 'insights', 'patterns', 'predictions'], default: 'dashboard' },
    showMetrics: { type: 'boolean', default: true },
    enableRealTime: { type: 'boolean', default: true }
  }
};

export default SmartTalentAnalytics;
