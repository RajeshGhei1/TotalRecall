
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '@/pages/superadmin/Dashboard';
import Tenants from '@/pages/superadmin/Tenants';
import Users from '@/pages/superadmin/Users';
import Companies from '@/pages/superadmin/Companies';
import People from '@/pages/superadmin/People';
import AIOrchestration from '@/pages/superadmin/AIOrchestration';
import AIAnalytics from '@/pages/superadmin/AIAnalytics';
import SubscriptionPlans from '@/pages/superadmin/SubscriptionPlans';
import GlobalSettings from '@/pages/superadmin/GlobalSettings';
import Settings from '@/pages/superadmin/Settings';

const SuperAdminRoutes = () => {
  return (
    <Routes>
      {/* Default redirect to dashboard */}
      <Route index element={<Navigate to="dashboard" replace />} />
      
      {/* Core Admin Pages */}
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="tenants" element={<Tenants />} />
      <Route path="users" element={<Users />} />
      <Route path="companies" element={<Companies />} />
      <Route path="people" element={<People />} />
      
      {/* AI & Analytics */}
      <Route path="ai-orchestration" element={<AIOrchestration />} />
      <Route path="ai-analytics" element={<AIAnalytics />} />
      
      {/* Business Management */}
      <Route path="subscription-plans" element={<SubscriptionPlans />} />
      
      {/* Settings */}
      <Route path="settings" element={<Settings />} />
      <Route path="global-settings" element={<GlobalSettings />} />
      
      {/* Legacy redirects */}
      <Route path="analytics" element={<Navigate to="dashboard" replace />} />
      <Route path="revenue" element={<Navigate to="dashboard" replace />} />
      <Route path="form-builder" element={<Navigate to="settings" replace />} />
    </Routes>
  );
};

export default SuperAdminRoutes;
