
import React from 'react';
import ATSDashboard from '@/components/ats/ATSDashboard';

interface AtsCoreProps {
  view?: 'dashboard' | 'jobs' | 'candidates' | 'pipeline';
  showMetrics?: boolean;
  allowCreate?: boolean;
}

const AtsCore: React.FC<AtsCoreProps> = ({ view, showMetrics, allowCreate }) => {
  return <ATSDashboard view={view} showMetrics={showMetrics} allowCreate={allowCreate} />;
};

// Module metadata for registration
(AtsCore as any).moduleMetadata = {
  id: 'ats-core',
  name: 'ATS Core',
  category: 'recruitment',
  version: '1.0.0',
  description: 'Core Applicant Tracking System with job and candidate management',
  author: 'System',
  requiredPermissions: ['read', 'write'],
  dependencies: [],
  props: {
    view: { type: 'string', options: ['dashboard', 'jobs', 'candidates', 'pipeline'], default: 'dashboard' },
    showMetrics: { type: 'boolean', default: true },
    allowCreate: { type: 'boolean', default: true }
  }
};

export default AtsCore;
