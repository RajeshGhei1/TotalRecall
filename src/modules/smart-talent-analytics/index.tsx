
import React from 'react';
import TalentAnalyticsDashboard from '@/components/talent-analytics/TalentAnalyticsDashboard';

interface SmartTalentAnalyticsProps {
  mode?: 'dashboard' | 'insights' | 'patterns' | 'predictions';
  showMetrics?: boolean;
  enableRealTime?: boolean;
}

const SmartTalentAnalytics: React.FC<SmartTalentAnalyticsProps> = (props) => {
  return <TalentAnalyticsDashboard {...props} />;
};

// Module metadata for registration
(SmartTalentAnalytics as unknown).moduleMetadata = {
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
