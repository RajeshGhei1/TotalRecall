
import { Routes, Route, Navigate } from 'react-router-dom';
import AnalyticsBusinessIntelligence from '@/pages/superadmin/AnalyticsBusinessIntelligence';
import Tenants from '@/pages/superadmin/Tenants';
import Users from '@/pages/superadmin/Users';
import Companies from '@/pages/superadmin/Companies';
import People from '@/pages/superadmin/People';
import AIOrchestration from '@/pages/superadmin/AIOrchestration';
import AIAnalytics from '@/pages/superadmin/AIAnalytics';
import AuditLogs from '@/pages/superadmin/AuditLogs';
import SubscriptionPlans from '@/pages/superadmin/SubscriptionPlans';
import GlobalSettings from '@/pages/superadmin/GlobalSettings';
import Settings from '@/pages/superadmin/Settings';

const SuperAdminRoutes = () => {
  return (
    <Routes>
      {/* Default redirect to dashboard */}
      <Route index element={<Navigate to="dashboard" replace />} />
      
      {/* Core Admin Pages */}
      <Route path="dashboard" element={<AnalyticsBusinessIntelligence />} />
      <Route path="tenants" element={<Tenants />} />
      <Route path="users" element={<Users />} />
      <Route path="companies" element={<Companies />} />
      <Route path="people" element={<People />} />
      
      {/* AI & Analytics */}
      <Route path="ai-orchestration" element={<AIOrchestration />} />
      <Route path="ai-analytics" element={<AIAnalytics />} />
      
      {/* Security & Compliance */}
      <Route path="audit-logs" element={<AuditLogs />} />
      <Route path="user-activity" element={<AuditLogs />} />
      
      {/* Business Management */}
      <Route path="subscription-plans" element={<SubscriptionPlans />} />
      
      {/* Settings */}
      <Route path="settings" element={<Settings />} />
      <Route path="global-settings" element={<GlobalSettings />} />
    </Routes>
  );
};

export default SuperAdminRoutes;
